const { exec } = require('child_process');
const fs = require('fs');

console.log('=== 测试依赖安装功能 ===\n');

// 模拟扩展激活时的依赖检查流程
console.log('1. 检查Python环境...');
exec('python --version', (err, stdout, stderr) => {
    if (err) {
        console.log('❌ Python环境不可用');
        console.log('请安装Python 3.6+并添加到PATH中');
        return;
    }
    
    console.log(`✅ Python环境可用: ${stdout.trim()}`);
    
    // 检查依赖库
    const requiredLibs = [
        { name: 'opencc', package: 'opencc-python-reimplemented', desc: '简繁体转换' },
        { name: 'googletrans', package: 'googletrans==4.0.0rc1', desc: 'Google翻译API' },
        { name: 'deep_translator', package: 'deep-translator', desc: '深度翻译器' },
        { name: 'translate', package: 'translate', desc: '基础翻译库' }
    ];
    
    console.log('\n2. 检查Python依赖库状态...\n');
    
    let installNeeded = false;
    const missingLibs = [];
    
    function checkLibrary(index) {
        if (index >= requiredLibs.length) {
            // 所有库检查完毕
            if (installNeeded) {
                console.log('\n3. 安装缺失的依赖库...\n');
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
    if (libraries.length === 0) return;
    
    const pipInstallCmd = `pip install ${libraries.join(' ')}`;
    
    console.log(`执行安装命令: ${pipInstallCmd}\n`);
    
    exec(pipInstallCmd, (err, stdout, stderr) => {
        if (err) {
            console.log('❌ 安装依赖库时出错:');
            console.log(`错误信息: ${err.message}`);
            console.log(`详细输出: ${stderr}`);
            
            console.log('\n💡 建议手动安装:');
            libraries.forEach(lib => {
                console.log(`   pip install ${lib}`);
            });
            return;
        }
        
        console.log('✅ Python依赖库安装成功!');
        console.log('安装输出:');
        console.log(stdout);
        console.log('\n🎉 依赖安装完成，插件可以正常使用所有功能');
    });
}