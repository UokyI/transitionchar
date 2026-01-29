# -*- coding: utf-8 -*-
"""
简繁体转换器模块
"""
import opencc
import sys
import io
import re


class ChineseConverter:
    def __init__(self):
        # 创建转换器实例
        self.s2t_converter = opencc.OpenCC('s2t')  # 简体到繁体
        self.t2s_converter = opencc.OpenCC('t2s')  # 繁体到简体

    def simplify(self, text):
        """
        将繁体中文转换为简体中文
        :param text: 输入文本（繁体）
        :return: 输出文本（简体）
        """
        return self.t2s_converter.convert(text)

    def traditionalize(self, text):
        """
        将简体中文转换为繁体中文
        :param text: 输入文本（简体）
        :return: 输出文本（繁体）
        """
        return self.s2t_converter.convert(text)

    def translate_to_english(self, text):
        """
        将中文转换为英文
        :param text: 输入文本（中文）
        :return: 输出文本（英文）
        """
        return self._translate_text(text, 'en')

    def translate_to_german(self, text):
        """
        将中文转换为德文
        :param text: 输入文本（中文）
        :return: 输出文本（德文）
        """
        return self._translate_text(text, 'de')

    def translate_to_vietnamese(self, text):
        """
        将中文转换为越南文
        :param text: 输入文本（中文）
        :return: 输出文本（越南文）
        """
        return self._translate_text(text, 'vi')

    def _translate_text(self, text, target_language):
        """
        内部翻译方法，用于翻译文本中的中文部分
        :param text: 输入文本
        :param target_language: 目标语言代码
        :return: 翻译后的文本
        """
        def attempt_translation(part, target_lang):
            # 尝试使用googletrans
            try:
                from googletrans import Translator
                translator = Translator()
                result = translator.translate(part, dest=target_lang, src='zh').text
                return result
            except Exception as e:
                print(f"Googletrans error: {e}", file=sys.stderr)
                pass
            
            # 尝试使用deep-translator
            try:
                from deep_translator import GoogleTranslator
                result = GoogleTranslator(source='zh', target=target_lang).translate(part)
                return result
            except Exception as e:
                print(f"Deep-translator error: {e}", file=sys.stderr)
                pass
            
            # 尝试使用translate库
            try:
                from translate import Translator
                translator = Translator(to_lang=target_lang, from_lang="zh")
                result = translator.translate(part)
                return result
            except Exception as e:
                print(f"Translate library error: {e}", file=sys.stderr)
                pass
            
            # 如果所有翻译都失败，返回原文
            return part
        
        # 如果输入文本为空，直接返回
        if not text:
            return text
        
        # 使用正则表达式找到所有中文字符块及其位置
        chinese_pattern = r'[\u4e00-\u9fff]+'
        
        # 使用re.finditer找出所有中文部分的位置和内容
        tokens = []
        last_end = 0
        for match in re.finditer(chinese_pattern, text):
            start, end = match.span()
            
            # 添加前面的非中文部分
            if start > last_end:
                tokens.append(('non_chinese', text[last_end:start]))
            
            # 添加中文部分
            tokens.append(('chinese', match.group()))
            last_end = end
        
        # 添加最后的非中文部分（如果有的话）
        if last_end < len(text):
            tokens.append(('non_chinese', text[last_end:]))
        
        # 处理每个token
        result = []
        for token_type, token_value in tokens:
            if token_type == 'chinese':
                # 这是一个中文字符块，需要翻译
                translated = attempt_translation(token_value, target_language)
                
                # 如果翻译成功，添加翻译结果
                result.append(translated)
            else:
                # 这不是中文字符，直接保留
                result.append(token_value)
        
        # 最后一步：确保没有意外引入的重复符号
        final_result = ''.join(result)
        
        # 特别处理：检查是否出现了重复的问号
        # 如果发现类似 "??" 或 "?？" 这样的模式，将其还原为单个问号
        final_result = re.sub(r'\? ?', '?', final_result)  # 处理英文问号重复
        final_result = re.sub(r'\?？', '？', final_result)  # 处理中英文问号混合
        final_result = re.sub(r'？\?', '？', final_result)  # 处理中英文问号混合
        
        return final_result

    def translate_to_chinese_simplified(self, text):
        """
        将英文转换为简体中文
        :param text: 输入文本（英文）
        :return: 输出文本（简体中文）
        """
        # 提取文本中的英文部分
        def attempt_translation(part):
            # 尝试使用googletrans
            try:
                from googletrans import Translator
                translator = Translator()
                result = translator.translate(part, dest='zh', src='en').text
                return result
            except:
                pass
            
            # 尝试使用deep-translator
            try:
                from deep_translator import GoogleTranslator
                result = GoogleTranslator(source='en', target='zh-CN').translate(part)
                return result
            except:
                pass
            
            # 尝试使用translate库
            try:
                from translate import Translator
                translator = Translator(to_lang="zh", from_lang="en")
                result = translator.translate(part)
                return result
            except:
                pass
            
            # 如果所有翻译都失败，返回原文
            return part
        
        # 使用正则表达式分离英文和其他字符
        english_words = r'[a-zA-Z]+'
        parts = re.split(f'({english_words})', text)
        
        result = []
        for part in parts:
            if re.search(english_words, part):
                translated = attempt_translation(part)
                result.append(translated)
            else:
                result.append(part)
        
        return ''.join(result)

    def translate_to_chinese_traditional(self, text):
        """
        将英文转换为繁体中文
        :param text: 输入文本（英文）
        :return: 输出文本（繁体中文）
        """
        # 先翻译为简体中文，再转换为繁体
        simplified = self.translate_to_chinese_simplified(text)
        return self.s2t_converter.convert(simplified)


def main():
    if len(sys.argv) != 3:
        print("Usage: python converter.py <action> <text>", file=sys.stderr)
        sys.exit(1)

    action = sys.argv[1]  # 'simplify', 'traditionalize', 'translate_en', 'translate_de', 'translate_vi', 'translate_zh_simp', 'translate_zh_trad'
    
    text = sys.argv[2]

    converter = ChineseConverter()

    if action == 'simplify':
        result = converter.simplify(text)
    elif action == 'traditionalize':
        result = converter.traditionalize(text)
    elif action == 'translate_en':
        result = converter.translate_to_english(text)
    elif action == 'translate_de':  # 新增：中文转德文
        result = converter.translate_to_german(text)
    elif action == 'translate_vi':  # 新增：中文转越南文
        result = converter.translate_to_vietnamese(text)
    elif action == 'translate_zh_simp':
        result = converter.translate_to_chinese_simplified(text)
    elif action == 'translate_zh_trad':
        result = converter.translate_to_chinese_traditional(text)
    else:
        print(f"Invalid action. Use 'simplify', 'traditionalize', 'translate_en', 'translate_de', 'translate_vi', 'translate_zh_simp', or 'translate_zh_trad'. Received: {action}", file=sys.stderr)
        sys.exit(1)

    # 设置标准输出为UTF-8编码并输出结果
    # 使用二进制模式写入，确保格式字符被正确保留
    if hasattr(sys.stdout, 'buffer'):
        sys.stdout.buffer.write(result.encode('utf-8'))
    else:
        # 兼容旧版本Python
        import codecs
        wrapper = codecs.getwriter("utf-8")(sys.stdout)
        wrapper.write(result)
    sys.stdout.flush()


if __name__ == "__main__":
    main()