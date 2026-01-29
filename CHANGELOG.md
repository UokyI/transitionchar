# Change Log

All notable changes to the "chinese-converter" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-29

### Added
- 基础简体中文与繁体中文转换功能
- 多语言翻译功能支持（中文->英文、德文、越南文）
- 右键菜单集成，使用"中文转换"聚合菜单
- Python后端处理支持
- 自动依赖安装和检查机制
- 国际化支持（中文、英文界面）
- 完善的错误处理和用户提示
- 环境诊断工具
- 详细的文档和使用说明

### Changed
- 优化菜单结构，按功能类型分组排序
- 改进依赖管理策略，区分开发和生产依赖
- 增强翻译库的容错能力和备用机制

### Fixed
- 解决调试正常但打包后失效的核心问题
- 修复Python依赖未自动安装导致的功能异常
- 改善网络超时和API限制情况下的用户体验
- 优化路径解析机制