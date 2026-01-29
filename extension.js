// @ts-check

const vscode = require('vscode');
const { PythonShell } = require('python-shell');
const path = require('path');
const { exec } = require('child_process');

/**
 * 激活扩展时调用此方法
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Chinese Converter extension activated!');

    // 在激活时自动检查和安装Python依赖
    checkAndInstallDependencies();

    // 注册简体转换命令
    let simplifyCmd = vscode.commands.registerCommand('chineseConverter.simplify', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }

        const selection = editor.selection;
        const originalText = editor.document.getText(selection);

        if (!originalText) {
            vscode.window.showWarningMessage('Please select some text first!');
            return;
        }

        try {
            const result = await convertText(originalText, 'simplify');
            
            // 检查结果是否为空或未定义
            if (!result || typeof result !== 'string' || result.trim().length === 0) {
                vscode.window.showErrorMessage('转换失败: 未能获取有效结果，保持原文本不变');
                return;
            }
            
            // 替换选中文本
            editor.edit(editBuilder => {
                editBuilder.replace(selection, result);
            });
        } catch (/** @type {any} */ error) {
            console.error('Conversion error:', error);
            vscode.window.showErrorMessage(`转换错误: ${error.message || error}，保持原文本不变`);
        }
    });

    // 注册繁体转换命令
    let traditionalizeCmd = vscode.commands.registerCommand('chineseConverter.traditionalize', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }

        const selection = editor.selection;
        const originalText = editor.document.getText(selection);

        if (!originalText) {
            vscode.window.showWarningMessage('Please select some text first!');
            return;
        }

        try {
            const result = await convertText(originalText, 'traditionalize');
            
            // 检查结果是否为空或未定义
            if (!result || typeof result !== 'string' || result.trim().length === 0) {
                vscode.window.showErrorMessage('转换失败: 未能获取有效结果，保持原文本不变');
                return;
            }
            
            // 替换选中文本
            editor.edit(editBuilder => {
                editBuilder.replace(selection, result);
            });
        } catch (/** @type {any} */ error) {
            console.error('Conversion error:', error);
            vscode.window.showErrorMessage(`转换错误: ${error.message || error}，保持原文本不变`);
        }
    });

    // 注册英文翻译命令
    let translateEnCmd = vscode.commands.registerCommand('chineseConverter.translateEn', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }

        const selection = editor.selection;
        const originalText = editor.document.getText(selection);

        if (!originalText) {
            vscode.window.showWarningMessage('Please select some text first!');
            return;
        }

        try {
            const result = await convertText(originalText, 'translate_en');
            
            // 检查结果是否为空或未定义
            if (!result || typeof result !== 'string' || result.trim().length === 0) {
                vscode.window.showErrorMessage('翻译失败: 未能获取有效结果，保持原文本不变');
                return;
            }
            
            // 替换选中文本
            editor.edit(editBuilder => {
                editBuilder.replace(selection, result);
            });
        } catch (/** @type {any} */ error) {
            console.error('Translation error:', error);
            vscode.window.showErrorMessage(`翻译错误: ${error.message || error}，保持原文本不变`);
        }
    });

    // 注册英文转简体中文命令
    let translateToScCmd = vscode.commands.registerCommand('chineseConverter.translateToSc', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }

        const selection = editor.selection;
        const originalText = editor.document.getText(selection);

        if (!originalText) {
            vscode.window.showWarningMessage('Please select some text first!');
            return;
        }

        try {
            const result = await convertText(originalText, 'translate_zh_simp');
            
            // 检查结果是否为空或未定义
            if (!result || typeof result !== 'string' || result.trim().length === 0) {
                vscode.window.showErrorMessage('翻译失败: 未能获取有效结果，保持原文本不变');
                return;
            }
            
            // 替换选中文本
            editor.edit(editBuilder => {
                editBuilder.replace(selection, result);
            });
        } catch (/** @type {any} */ error) {
            console.error('Translation error:', error);
            vscode.window.showErrorMessage(`翻译错误: ${error.message || error}，保持原文本不变`);
        }
    });

    // 注册英文转繁体中文命令
    let translateToTcCmd = vscode.commands.registerCommand('chineseConverter.translateToTc', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }

        const selection = editor.selection;
        const originalText = editor.document.getText(selection);

        if (!originalText) {
            vscode.window.showWarningMessage('Please select some text first!');
            return;
        }

        try {
            const result = await convertText(originalText, 'translate_zh_trad');
            
            // 检查结果是否为空或未定义
            if (!result || typeof result !== 'string' || result.trim().length === 0) {
                vscode.window.showErrorMessage('翻译失败: 未能获取有效结果，保持原文本不变');
                return;
            }
            
            // 替换选中文本
            editor.edit(editBuilder => {
                editBuilder.replace(selection, result);
            });
        } catch (/** @type {any} */ error) {
            console.error('Translation error:', error);
            vscode.window.showErrorMessage(`翻译错误: ${error.message || error}，保持原文本不变`);
        }
    });

    // 注册中文转英文命令
    let translateToEnCmd = vscode.commands.registerCommand('chineseConverter.translateToEn', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }

        const selection = editor.selection;
        const originalText = editor.document.getText(selection);

        if (!originalText) {
            vscode.window.showWarningMessage('Please select some text first!');
            return;
        }

        try {
            const result = await convertText(originalText, 'translate_en');
            
            // 检查结果是否为空或未定义
            if (!result || typeof result !== 'string' || result.trim().length === 0) {
                vscode.window.showErrorMessage('翻译失败: 未能获取有效结果，保持原文本不变');
                return;
            }
            
            // 替换选中文本
            editor.edit(editBuilder => {
                editBuilder.replace(selection, result);
            });
        } catch (/** @type {any} */ error) {
            console.error('Translation error:', error);
            vscode.window.showErrorMessage(`翻译错误: ${error.message || error}，保持原文本不变`);
        }
    });

    // 注册中文转德文命令
    let translateToDeCmd = vscode.commands.registerCommand('chineseConverter.translateToDe', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }

        const selection = editor.selection;
        const originalText = editor.document.getText(selection);

        if (!originalText) {
            vscode.window.showWarningMessage('Please select some text first!');
            return;
        }

        try {
            const result = await convertText(originalText, 'translate_de');
            
            // 检查结果是否为空或未定义
            if (!result || typeof result !== 'string' || result.trim().length === 0) {
                vscode.window.showErrorMessage('翻译失败: 未能获取有效结果，保持原文本不变');
                return;
            }
            
            // 替换选中文本
            editor.edit(editBuilder => {
                editBuilder.replace(selection, result);
            });
        } catch (/** @type {any} */ error) {
            console.error('Translation error:', error);
            vscode.window.showErrorMessage(`翻译错误: ${error.message || error}，保持原文本不变`);
        }
    });

    // 注册中文转越南文命令
    let translateToViCmd = vscode.commands.registerCommand('chineseConverter.translateToVi', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }

        const selection = editor.selection;
        const originalText = editor.document.getText(selection);

        if (!originalText) {
            vscode.window.showWarningMessage('Please select some text first!');
            return;
        }

        try {
            const result = await convertText(originalText, 'translate_vi');
            
            // 检查结果是否为空或未定义
            if (!result || typeof result !== 'string' || result.trim().length === 0) {
                vscode.window.showErrorMessage('翻译失败: 未能获取有效结果，保持原文本不变');
                return;
            }
            
            // 替换选中文本
            editor.edit(editBuilder => {
                editBuilder.replace(selection, result);
            });
        } catch (/** @type {any} */ error) {
            console.error('Translation error:', error);
            vscode.window.showErrorMessage(`翻译错误: ${error.message || error}，保持原文本不变`);
        }
    });

    context.subscriptions.push(simplifyCmd);
    context.subscriptions.push(traditionalizeCmd);
    context.subscriptions.push(translateEnCmd);
    context.subscriptions.push(translateToScCmd);
    context.subscriptions.push(translateToTcCmd);
    context.subscriptions.push(translateToEnCmd);
    context.subscriptions.push(translateToDeCmd);
    context.subscriptions.push(translateToViCmd);
    
    // 注册诊断命令
    let diagnoseCmd = vscode.commands.registerCommand('chineseConverter.diagnose', diagnoseEnvironment);
    context.subscriptions.push(diagnoseCmd);
}

/**
 * 自动检查并安装Python依赖
 */
function checkAndInstallDependencies() {
    console.log('=== 开始检查Python依赖 ===');
    
    // 检查Python环境
    exec('python --version', (err, stdout, stderr) => {
        if (err) {
            vscode.window.showErrorMessage('错误: 未找到Python环境，请安装Python 3.6+并添加到PATH中');
            return;
        }

        console.log(`✅ Python环境检查通过: ${stdout.trim()}`);

        // 检查各个Python依赖库
        const requiredLibs = [
            { name: 'opencc', package: 'opencc-python-reimplemented', desc: '简繁体转换' },
            { name: 'googletrans', package: 'googletrans==4.0.0rc1', desc: 'Google翻译API' },
            { name: 'deep_translator', package: 'deep-translator', desc: '深度翻译器' },
            { name: 'translate', package: 'translate', desc: '基础翻译库' }
        ];

        console.log('🔍 检查Python依赖库状态...');
        
        let installNeeded = false;
        const missingLibs = [];
        
        // 检查每个库
        function checkLibrary(index) {
            if (index >= requiredLibs.length) {
                // 所有库检查完毕
                if (installNeeded) {
                    console.log('📥 开始安装缺失的依赖库...');
                    installMissingLibraries(missingLibs);
                } else {
                    console.log('✅ 所有依赖库均已安装，插件可以正常使用');
                    vscode.window.showInformationMessage('Chinese Converter: 所有依赖已就绪，可以正常使用');
                }
                return;
            }

            const lib = requiredLibs[index];
            exec(`python -c "import ${lib.name}"`, (err, stdout, stderr) => {
                if (err) {
                    console.log(`❌ ${lib.desc} (${lib.name}): 未安装`);
                    installNeeded = true;
                    missingLibs.push(lib.package);
                } else {
                    console.log(`✅ ${lib.desc} (${lib.name}): 已安装`);
                }
                checkLibrary(index + 1);
            });
        }

        checkLibrary(0);
    });
}

/**
 * 安装缺失的Python依赖库
 * @param {string[]} libraries 需要安装的库列表
 */
function installMissingLibraries(libraries) {
    if (libraries.length === 0) return;
    
    vscode.window.showInformationMessage(`Chinese Converter: 正在安装缺失的依赖库...`);
    
    const pipInstallCmd = `pip install ${libraries.join(' ')}`;
    
    console.log(`执行安装命令: ${pipInstallCmd}`);
    
    exec(pipInstallCmd, (err, stdout, stderr) => {
        if (err) {
            console.error('❌ 安装依赖库时出错:');
            console.error(`错误信息: ${err.message}`);
            console.error(`详细输出: ${stderr}`);
            
            // 显示错误信息给用户
            vscode.window.showErrorMessage(
                `依赖安装失败: ${err.message}\n` +
                `请手动执行: ${pipInstallCmd}\n` +
                `或查看输出面板获取详细信息`
            );
            
            // 提供手动安装建议
            console.log('\n💡 建议手动安装:');
            libraries.forEach(lib => {
                console.log(`   pip install ${lib}`);
            });
            return;
        }

        console.log('✅ Python依赖库安装成功!');
        console.log('安装输出:');
        console.log(stdout);
        console.log('\n🎉 插件环境配置完成，现在可以正常使用所有功能');
        
        vscode.window.showInformationMessage('Chinese Converter: 依赖安装完成，现在可以正常使用所有功能!');
    });
}

/**
 * 执行Python转换脚本
 * @param {string} text 要转换的文本
 * @param {string} action 转换类型 ('simplify', 'traditionalize' 或 'translate_en')
 * @returns {Promise<string>} 转换后的文本
 */
async function convertText(text, action) {
    return new Promise((resolve, reject) => {
        // 多种方式获取扩展信息
        // 获取扩展信息 - 使用正确的发布者ID
        const extension = vscode.extensions.getExtension('uokyi.chinese-converter');
        
        if (!extension) {
            console.log('无法获取扩展信息，使用备用方案');
        } else {
            console.log(`找到扩展，ID: uokyi.chinese-converter`);
        }
        
        const fs = require('fs'); // 统一在这里声明
        
        if (!extension) {
            // 最后的备用方案：使用当前文件所在目录
            console.log('无法获取扩展信息，使用备用方案');
            const path = require('path');
            
            // 尝试几种可能的路径
            const possiblePaths = [
                path.join(__dirname, 'converter.py'),
                path.resolve('./converter.py'),
                path.join(process.cwd(), 'converter.py')
            ];
            
            let converterPath = null;
            for (const testPath of possiblePaths) {
                if (fs.existsSync(testPath)) {
                    converterPath = testPath;
                    console.log(`找到转换脚本: ${converterPath}`);
                    break;
                }
            }
            
            if (!converterPath) {
                reject(new Error('无法找到转换脚本文件'));
                return;
            }
            
            executePythonScript(converterPath, text, action, resolve, reject);
            return;
        }
        
        const extensionPath = extension.extensionPath;
        const converterPath = path.join(extensionPath, 'converter.py');
        
        // 检查Python脚本是否存在
        if (!fs.existsSync(converterPath)) {
            console.log(`主路径不存在: ${converterPath}`);
            // 尝试备用路径
            const backupPath = path.join(__dirname, 'converter.py');
            if (fs.existsSync(backupPath)) {
                console.log(`使用备用路径: ${backupPath}`);
                executePythonScript(backupPath, text, action, resolve, reject);
                return;
            } else {
                reject(new Error(`找不到转换脚本: ${converterPath}`));
                return;
            }
        } else {
            console.log(`找到转换脚本: ${converterPath}`);
            executePythonScript(converterPath, text, action, resolve, reject);
        }
    });
}

/**
 * 执行Python脚本的核心函数
 * @param {string} scriptPath 脚本路径
 * @param {string} text 文本内容
 * @param {string} action 操作类型
 * @param {Function} resolve Promise resolve函数
 * @param {Function} reject Promise reject函数
 */
function executePythonScript(scriptPath, text, action, resolve, reject) {
    const options = {
        mode: /** @type {'text'} */ ('text'),
        pythonPath: 'python',
        pythonOptions: ['-u', '-X', 'utf8'],  // 使用UTF-8编码
        encoding: /** @type {'utf8'} */ ('utf8'),  // 设置编码
        args: [action, text]
    };

    console.log(`正在执行转换: ${action}, 文本长度: ${text.length}`);
    console.log(`脚本路径: ${scriptPath}`);

    // 创建PythonShell实例进行更精确的控制
    const pyshell = new PythonShell(scriptPath, options);
    
    let stdoutResult = '';
    let stderrOutput = '';
    let hasDataReceived = false; // 标记是否收到过数据
    
    // 收集标准输出
    pyshell.stdout.on('data', function (data) {
        hasDataReceived = true;
        const chunk = Buffer.isBuffer(data) ? data.toString('utf8') : data.toString();
        stdoutResult += chunk;
        console.log('Received stdout chunk:', chunk.length, 'chars');
    });
    
    // 收集错误输出
    pyshell.stderr.on('data', function (data) {
        const chunk = Buffer.isBuffer(data) ? data.toString('utf8') : data.toString();
        stderrOutput += chunk;
        console.log('Received stderr chunk:', chunk);
    });
    
    // 监听进程结束
    pyshell.on('close', function (/** @type {number | null} */ code) {
        console.log(`Python脚本关闭，退出码: ${code}`);
        console.log(`标准输出长度: ${stdoutResult.length}`);
        console.log(`错误输出长度: ${stderrOutput.length}`);
        
        // 处理各种退出码情况
        if (code === 0 || code === null || code === undefined) {
            // 当code为0, null或undefined时，如果有输出则认为成功
            if (stdoutResult.length > 0) {
                resolve(stdoutResult);
            } else {
                // 如果没有输出，但有错误信息
                if (stderrOutput.length > 0) {
                    reject(new Error(`Python脚本执行出错: ${stderrOutput}`));
                } else {
                    // 没有任何输出也没有错误信息
                    reject(new Error('Python脚本执行完成但没有返回任何结果'));
                }
            }
        } else {
            // 非0退出码表示错误
            reject(new Error(`Python脚本退出码非0: ${code}, 错误信息: ${stderrOutput}`));
        }
    });
    
    // 监听错误事件
    pyshell.on('error', function (/** @type {any} */ err) {
        console.error('PythonShell error:', err);
        reject(new Error(`执行Python脚本时发生错误: ${err.message || err}`));
    });
}

// 只使用 module.exports 导出，避免重复
module.exports = {
    activate,
    deactivate
};

/**
 * 停用扩展时调用此方法
 */
function deactivate() {}

/**
 * 环境诊断命令
 */
async function diagnoseEnvironment() {
    const outputChannel = vscode.window.createOutputChannel('Chinese Converter Diagnostics');
    outputChannel.show();
    
    outputChannel.appendLine('=== Chinese Converter 环境诊断 ===');
    outputChannel.appendLine(`诊断时间: ${new Date().toISOString()}`);
    outputChannel.appendLine('');
    
    // 1. VSCode环境信息
    outputChannel.appendLine('=== VSCode环境信息 ===');
    outputChannel.appendLine(`VSCode版本: ${vscode.version}`);
    outputChannel.appendLine(`工作区路径: ${vscode.workspace.rootPath || '无'}`);
    outputChannel.appendLine(`操作系统: ${process.platform} ${process.arch}`);
    outputChannel.appendLine('');
    
    // 2. 扩展状态检查
    outputChannel.appendLine('=== 扩展状态检查 ===');
    const extension = vscode.extensions.getExtension('uokyi.chinese-converter');
    if (extension) {
        outputChannel.appendLine('✅ 扩展已安装');
        outputChannel.appendLine(`扩展ID: uokyi.chinese-converter`);
        outputChannel.appendLine(`扩展版本: ${extension.packageJSON.version}`);
        outputChannel.appendLine(`扩展路径: ${extension.extensionPath}`);
        outputChannel.appendLine(`是否激活: ${extension.isActive}`);
        
        // 检查关键文件
        outputChannel.appendLine('\n--- 文件完整性检查 ---');
        const keyFiles = ['converter.py', 'extension.js', 'package.json'];
        const fs = require('fs');
        const path = require('path');
        
        keyFiles.forEach(filename => {
            const filePath = path.join(extension.extensionPath, filename);
            try {
                const exists = fs.existsSync(filePath);
                const size = exists ? fs.statSync(filePath).size : 0;
                outputChannel.appendLine(`${exists ? '✅' : '❌'} ${filename}: ${exists ? `${size} bytes` : '文件不存在'}`);
            } catch (error) {
                outputChannel.appendLine(`❌ ${filename}: 检查失败 - ${error.message}`);
            }
        });
    } else {
        outputChannel.appendLine('❌ 扩展未找到');
        outputChannel.appendLine('建议: 请重新安装扩展');
        return;
    }
    outputChannel.appendLine('');
    
    // 3. Python环境检查
    outputChannel.appendLine('=== Python环境检查 ===');
    try {
        const { execSync } = require('child_process');
        
        // 检查Python版本
        try {
            const versionOutput = execSync('python --version', { encoding: 'utf8' });
            outputChannel.appendLine(`✅ Python版本: ${versionOutput.trim()}`);
        } catch (error) {
            outputChannel.appendLine(`❌ 无法获取Python版本: ${error.message}`);
        }
        
        // 检查Python路径
        try {
            const pathOutput = execSync('python -c "import sys; print(sys.executable)"', { encoding: 'utf8' });
            outputChannel.appendLine(`✅ Python路径: ${pathOutput.trim()}`);
        } catch (error) {
            outputChannel.appendLine(`❌ 无法获取Python路径: ${error.message}`);
        }
        
        // 检查关键依赖
        const dependencies = [
            { name: 'opencc', check: 'import opencc' },
            { name: 'googletrans', check: 'import googletrans' },
            { name: 'deep_translator', check: 'import deep_translator' }
        ];
        
        outputChannel.appendLine('\n--- Python依赖检查 ---');
        dependencies.forEach(dep => {
            try {
                execSync(`python -c "${dep.check}"`, { stdio: 'ignore' });
                outputChannel.appendLine(`✅ ${dep.name}: 可用`);
            } catch (error) {
                outputChannel.appendLine(`❌ ${dep.name}: 不可用`);
            }
        });
        
    } catch (error) {
        outputChannel.appendLine(`❌ Python环境检查失败: ${error.message}`);
    }
    outputChannel.appendLine('');
    
    // 4. 路径解析测试
    outputChannel.appendLine('=== 路径解析测试 ===');
    try {
        const resolvedPath = findConverterScript();
        outputChannel.appendLine(`✅ 路径解析成功: ${resolvedPath}`);
    } catch (error) {
        outputChannel.appendLine(`❌ 路径解析失败: ${error.message}`);
    }
    outputChannel.appendLine('');
    
    // 5. 性能测试
    outputChannel.appendLine('=== 性能基准测试 ===');
    const testText = "簡體字轉換測試";
    const startTime = Date.now();
    
    try {
        const result = await convertText(testText, 'simplify');
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        outputChannel.appendLine(`✅ 简体转换测试: ${duration}ms`);
        outputChannel.appendLine(`   输入: ${testText}`);
        outputChannel.appendLine(`   输出: ${result}`);
    } catch (error) {
        outputChannel.appendLine(`❌ 简体转换测试失败: ${error.message}`);
    }
    
    outputChannel.appendLine('\n=== 诊断完成 ===');
    vscode.window.showInformationMessage('诊断完成，请查看输出面板结果');
}

/**
 * 查找转换脚本路径的改进版本
 */
function findConverterScript() {
    const fs = require('fs');
    
    // 方法1: 通过VSCode扩展API获取路径
    const extension = vscode.extensions.getExtension('uokyi.chinese-converter');
    if (extension) {
        const extensionPath = extension.extensionPath;
        const converterPath = path.join(extensionPath, 'converter.py');
        if (fs.existsSync(converterPath)) {
            return converterPath;
        }
    }
    
    // 方法2: 使用当前文件所在目录
    const backupPath = path.join(__dirname, 'converter.py');
    if (fs.existsSync(backupPath)) {
        return backupPath;
    }
    
    // 方法3: 使用相对路径
    const relativePath = path.resolve('./converter.py');
    if (fs.existsSync(relativePath)) {
        return relativePath;
    }
    
    throw new Error('无法找到转换脚本文件');
}
