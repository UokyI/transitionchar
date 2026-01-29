# Chinese Converter 插件依赖问题解决方案

## 🎯 问题描述

新用户安装插件后出现以下错误：
```
转换错误: Python脚本执行出错: Traceback (most recent call last): 
File "D:\commonplugin\.vscode\extensions\uokyi.chinese-converter-1.1.0\converter.py", line 5, in <module> 
import opencc 
ModuleNotFoundError: No module named 'opencc'
```

## 🔍 问题分析

### 根本原因
1. **依赖未自动安装**：扩展激活时没有自动检查和安装Python依赖
2. **用户环境差异**：新用户的Python环境中缺少必要的第三方库
3. **缺乏友好的错误提示**：用户不知道如何解决依赖问题

### 技术细节
- 插件需要 `opencc-python-reimplemented` 等Python库才能正常工作
- 调试时这些依赖通常已经安装，所以功能正常
- 打包安装后，新用户环境中缺少这些依赖导致功能失效

## 🛠️ 解决方案

### 1. 自动依赖检查机制

在 `extension.js` 的 `activate()` 函数中添加自动依赖检查：

```javascript
function activate(context) {
    console.log('Chinese Converter extension activated!');
    
    // 在激活时自动检查和安装Python依赖
    checkAndInstallDependencies();
    
    // ... 其他初始化代码
}
```

### 2. 智能依赖安装

实现逐步检查和安装机制：

```javascript
function checkAndInstallDependencies() {
    // 1. 检查Python环境
    // 2. 逐一检查所需依赖库
    // 3. 自动安装缺失的库
    // 4. 提供友好的用户反馈
}
```

### 3. 用户友好的错误处理

- 显示清晰的错误信息
- 提供手动安装指导
- 添加诊断命令帮助用户排查问题

## 📦 版本更新

### v1.1.1 主要改进

1. **自动依赖管理**
   - 扩展激活时自动检查Python依赖
   - 缺失依赖时自动安装
   - 实时反馈安装进度

2. **增强的诊断功能**
   - 添加"诊断环境状态"命令
   - 详细的环境信息输出
   - 性能基准测试

3. **改进的用户体验**
   - 清晰的状态提示信息
   - 错误时保持原文本不变
   - 提供手动解决建议

## 🚀 使用说明

### 对于新用户

1. **安装插件**
   - 下载 `.vsix` 文件或从市场安装
   - 重启 VSCode

2. **首次使用**
   - 插件会自动检查Python环境
   - 自动安装缺失的依赖库
   - 显示安装进度和结果

3. **遇到问题时**
   - 使用 `诊断环境状态` 命令查看详细信息
   - 根据提示手动安装依赖（如有需要）

### 对于开发者

1. **打包发布**
   ```bash
   vsce package
   ```

2. **测试验证**
   ```bash
   # 完全卸载旧版本
   # 安装新版本 .vsix 文件
   # 重启 VSCode 测试功能
   ```

## 🧪 测试验证

### 自动化测试脚本

运行 `test_dependency_install.js` 验证依赖检查功能：

```bash
node test_dependency_install.js
```

### 手动测试流程

1. 在干净环境中安装插件
2. 打开包含中文文本的文件
3. 选中文本，右键选择转换功能
4. 观察是否自动安装依赖并成功转换

## 📋 依赖清单

插件需要以下Python依赖：

| 库名 | 用途 | 版本要求 |
|------|------|----------|
| opencc-python-reimplemented | 简繁体转换 | ^0.1.7 |
| googletrans | Google翻译API | ==4.0.0rc1 |
| deep-translator | 多引擎翻译 | latest |
| translate | 基础翻译功能 | latest |

## 🔧 故障排除

### 常见问题及解决方案

1. **Python环境问题**
   - 确保安装Python 3.6+
   - 将Python添加到系统PATH

2. **权限问题**
   - 以管理员身份运行VSCode
   - 或手动执行pip安装命令

3. **网络问题**
   - 检查网络连接
   - 尝试更换pip源

### 诊断命令

使用 `诊断环境状态` 命令获取详细信息：
- VSCode环境信息
- 扩展状态检查
- Python环境验证
- 依赖库状态
- 性能基准测试

## 🎉 预期效果

通过本次修复，用户将获得：
- ✅ 首次使用时自动配置环境
- ✅ 清晰的状态反馈和错误提示
- ✅ 完善的诊断和排错工具
- ✅ 稳定可靠的转换功能

这彻底解决了"调试正常但打包后失效"的核心问题！