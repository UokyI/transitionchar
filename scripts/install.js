const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== VSCode插件依赖检查与安装 ===');

// 检查是否安装了Python
exec('python --version', (err, stdout, stderr) => {
    if (err) {
        console.error('❌ 错误: 未找到Python');
        console.error('请确保已安装Python 3.6+并将其添加到PATH中');
        console.error('下载地址: https://www.python.org/downloads/');
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

    console.log('\n🔍 检查Python依赖库状态...');
    
    let installNeeded = false;
    const missingLibs = [];
    
    // 检查每个库
    function checkLibrary(index) {
        if (index >= requiredLibs.length) {
            // 所有库检查完毕
            if (installNeeded) {
                console.log('\n📥 开始安装缺失的依赖库...');
                installMissingLibraries(missingLibs);
            } else {
                console.log('\n✅ 所有依赖库均已安装，插件可以正常使用');
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

function installMissingLibraries(libraries) {
    const pipInstallCmd = `pip install ${libraries.join(' ')}`;
    
    console.log(`执行安装命令: ${pipInstallCmd}`);
    
    exec(pipInstallCmd, (err, stdout, stderr) => {
        if (err) {
            console.error('❌ 安装依赖库时出错:');
            console.error(`错误信息: ${err.message}`);
            console.error(`详细输出: ${stderr}`);
            
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
    });
}