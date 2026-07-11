import { englishTemplates } from './templates.en';
import type { Locale } from '../types';

export interface ResumeTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  markdown: string;
}

interface TemplateSeed extends Omit<ResumeTemplate, 'markdown'> {
  summary: string;
  skills: string;
  achievement: string;
  project: string;
}

const createMarkdown = (seed: TemplateSeed) => `# 陈一凡

**${seed.title}**

上海 | 138 0000 0000 | chen@example.com | [github.com/chenyifan](https://github.com/chenyifan)

## 个人简介

${seed.summary}

## 核心能力

${seed.skills}

## 工作经历

### ${seed.title} | 远山科技
*2021.04 - 至今 | 上海*

- ${seed.achievement}
- 负责关键项目从需求分析到交付复盘的完整流程，连续 8 个季度按期完成目标
- 建立团队协作规范与质量度量机制，跨团队沟通成本降低 30%

### ${seed.title} | 云帆网络
*2018.07 - 2021.03 | 杭州*

- 主导 3 个核心业务模块建设，服务超过 100 万用户
- 通过流程与工具优化，将平均交付周期从 4 周缩短到 2.5 周

## 代表项目

### ${seed.project}

- 识别业务瓶颈，制定分阶段方案并协调产品、设计与研发共同落地
- 上线后核心指标提升 35%，沉淀的方法被复制到另外 3 条业务线

## 认证与荣誉

- 获得年度优秀员工，负责项目入选公司级最佳实践案例
- 完成专业领域高级认证，并持续参加行业课程和技术研讨会

## 社区与分享

- 在团队内部组织 12 次专题分享，覆盖工程实践、业务方法与协作经验
- 维护个人知识库并参与开源社区，相关文章累计阅读超过 5 万次

## 教育经历

### 浙江大学 | 计算机科学与技术 学士
*2014.09 - 2018.06*

## 其他信息

- **语言：** 中文（母语）、英语（工作沟通）
- **个人主页：** [chenyifan.dev](https://chenyifan.dev)`;

const seeds: TemplateSeed[] = [
  { id: 'frontend-developer', title: '前端开发工程师', category: '工程研发', description: '适合 React、TypeScript 与现代 Web 开发者', summary: '6 年前端开发经验，专注复杂 Web 应用、设计系统和性能优化，能够将产品目标转化为稳定、可维护的前端方案。', skills: '- **前端：** React、TypeScript、Vite、CSS、可访问性\n- **工程：** 性能优化、组件库、自动化测试、持续集成', achievement: '完成核心平台 React 架构升级，首屏时间从 3.2 秒降低到 1.4 秒', project: '企业级设计系统' },
  { id: 'fullstack-developer', title: '全栈开发工程师', category: '工程研发', description: '适合负责完整产品技术栈的工程师', summary: '具备前后端与云基础设施经验，擅长快速构建可靠产品并持续优化系统性能和开发效率。', skills: '- **前端：** React、Next.js、TypeScript\n- **后端：** Node.js、Go、PostgreSQL、Redis\n- **云平台：** Docker、Kubernetes、AWS', achievement: '设计并交付订单平台，稳定支撑日均 500 万次 API 请求', project: '一体化 SaaS 工作台' },
  { id: 'devops-engineer', title: 'DevOps 工程师', category: '工程研发', description: '基础设施、可靠性与平台工程方向', summary: '专注云原生基础设施、研发效能与稳定性建设，拥有大规模生产环境运维和故障治理经验。', skills: '- **平台：** Kubernetes、Terraform、AWS、Linux\n- **交付：** GitHub Actions、Argo CD、可观测性\n- **语言：** Go、Python、Shell', achievement: '建设统一交付平台，将部署耗时从 45 分钟缩短到 8 分钟', project: '云原生研发平台' },
  { id: 'senior-engineer', title: '高级软件工程师', category: '工程研发', description: '突出技术领导力和复杂系统经验', summary: '10 年软件研发经验，善于复杂系统设计、技术决策与工程团队辅导，在高并发和高可靠领域有丰富实践。', skills: '- **架构：** 分布式系统、领域建模、事件驱动\n- **工程：** Java、Go、微服务、性能调优\n- **领导力：** 技术规划、评审、人才培养', achievement: '主导支付系统重构，吞吐量提升 4 倍且全年可用性达到 99.99%', project: '下一代交易基础设施' },
  { id: 'modern-developer', title: '软件开发工程师', category: '工程研发', description: '适用于通用软件研发岗位', summary: '注重代码质量与用户价值的软件工程师，能够独立完成需求澄清、系统实现、测试和上线维护。', skills: '- **语言：** Java、Python、TypeScript\n- **数据：** MySQL、Redis、Elasticsearch\n- **实践：** 单元测试、代码评审、敏捷开发', achievement: '重构客户管理系统，接口错误率下降 60%，迭代效率提升 25%', project: '智能客户服务系统' },
  { id: 'research-engineer', title: '研究工程师', category: '工程研发', description: '连接学术研究与产品工程', summary: '兼具算法研究和产品工程能力，擅长把论文方法转化为可扩展、可评估的生产系统。', skills: '- **研究：** 机器学习、自然语言处理、实验设计\n- **工程：** Python、PyTorch、CUDA、MLOps\n- **成果：** 论文复现、专利、技术报告', achievement: '将新型检索算法落地生产，相关性提升 18%，推理成本降低 22%', project: '多模态内容理解平台' },
  { id: 'data-scientist', title: '数据科学家', category: '数据与 AI', description: '用量化成果展示机器学习与分析能力', summary: '擅长从复杂数据中提炼业务洞察，构建可解释的预测模型，并推动模型在真实业务流程中产生价值。', skills: '- **建模：** Python、SQL、PyTorch、因果推断\n- **数据：** Spark、Airflow、特征平台\n- **业务：** 指标体系、A/B 测试、可视化', achievement: '构建流失预测模型，召回率达到 87%，年度挽回收入超过 1200 万元', project: '智能增长决策平台' },
  { id: 'product-manager', title: '产品经理', category: '产品', description: '面向 B2B、SaaS 与平台产品', summary: '8 年企业软件产品经验，擅长用户研究、产品规划和跨职能交付，以可衡量的业务结果驱动迭代。', skills: '- **产品：** 战略规划、需求分析、路线图、数据分析\n- **协作：** 用户访谈、原型、敏捷交付\n- **业务：** SaaS、平台产品、商业化', achievement: '从零推出协作产品，12 个月内获得 300 家付费客户，续费率达到 92%', project: '企业协作平台 2.0' },
  { id: 'ux-designer', title: 'UX / UI 设计师', category: '设计', description: '突出用户研究与产品设计成果', summary: '以研究为基础的产品设计师，关注复杂工作流、信息架构和设计系统，能够平衡用户体验与商业目标。', skills: '- **设计：** Figma、原型、交互设计、视觉设计\n- **研究：** 访谈、可用性测试、用户旅程\n- **系统：** 设计语言、组件规范、无障碍', achievement: '重新设计核心工作流，任务完成率提升 28%，用户满意度提升 16 分', project: '跨端设计系统' },
  { id: 'creative-professional', title: '创意设计师', category: '设计', description: '同时展示创意能力与商业影响', summary: '拥有品牌、数字内容和整合营销经验的创意人才，善于建立一致的视觉叙事并交付高质量作品。', skills: '- **创意：** 品牌策略、艺术指导、内容策划\n- **工具：** Adobe CC、Figma、摄影、视频\n- **管理：** 供应商管理、预算、项目统筹', achievement: '主导品牌焕新，品牌认知度提升 34%，活动转化率提升 21%', project: '年度品牌整合传播' },
  { id: 'graphic-designer', title: '平面设计师', category: '设计', description: '极简且重视字体与版式', summary: '注重字体、版式与细节的视觉设计师，拥有品牌识别、出版物和数字营销物料设计经验。', skills: '- **视觉：** 字体设计、版式、品牌识别、信息图\n- **工具：** Illustrator、InDesign、Photoshop\n- **制作：** 印刷规范、数字资产、色彩管理', achievement: '建立品牌视觉模板库，使营销物料制作效率提升 45%', project: '全球品牌视觉规范' },
  { id: 'business-analyst', title: '业务分析师', category: '商业分析', description: '连接业务需求与技术交付', summary: '擅长业务流程分析、数据洞察和需求管理，能够在业务团队与技术团队之间建立清晰共识。', skills: '- **分析：** SQL、Excel、Tableau、指标体系\n- **流程：** BPMN、需求建模、验收测试\n- **行业：** 零售、供应链、企业数字化', achievement: '优化采购流程，库存周转天数降低 18%，年度节省成本 800 万元', project: '供应链数字化转型' },
  { id: 'project-manager', title: '项目经理', category: '管理', description: '突出按期交付与跨团队协调', summary: '拥有大型数字化项目管理经验，擅长范围、风险、预算和干系人管理，确保复杂项目稳定交付。', skills: '- **管理：** 项目规划、风险、预算、供应商\n- **方法：** Agile、Scrum、PMP、OKR\n- **工具：** Jira、Confluence、Microsoft Project', achievement: '管理 3000 万元数字化项目，提前 3 周上线并控制在预算内', project: '集团 ERP 升级项目' },
  { id: 'career-changer', title: '转行求职者', category: '通用', description: '突出可迁移能力与清晰转型动机', summary: '拥有成熟行业经验并完成系统化技术训练，善于把客户洞察、项目推进和数据分析能力应用到新岗位。', skills: '- **可迁移能力：** 沟通、项目管理、问题解决\n- **新技能：** Web 开发、SQL、数据分析\n- **学习：** 训练营、认证、独立项目', achievement: '在原岗位推动数字化流程改造，将客户响应时间缩短 40%', project: '个人作品集与任务管理应用' },
  { id: 'recent-graduate', title: '应届毕业生', category: '通用', description: '把课程、实习与项目转化为竞争力', summary: '计算机专业应届毕业生，具备扎实的编程基础、实习经验和团队项目经历，对工程质量和用户体验保持关注。', skills: '- **课程：** 数据结构、操作系统、数据库、计算机网络\n- **技术：** Java、Python、React、MySQL\n- **实践：** 实习、竞赛、开源贡献', achievement: '实习期间完成自动化报表工具，每周节省团队 12 小时重复工作', project: '校园二手交易平台' },
  { id: 'student-resume', title: '在校学生', category: '通用', description: '面向实习和初级岗位的第一份简历', summary: '积极主动的计算机专业学生，通过课程项目、社团和竞赛积累软件开发与团队协作经验。', skills: '- **基础：** C++、Python、JavaScript、Git\n- **课程：** 算法、数据库、Web 开发\n- **活动：** 编程竞赛、技术社团、志愿服务', achievement: '担任课程项目负责人，带领 4 人团队获得优秀项目评分', project: '智能学习计划助手' },
  { id: 'academic-cv', title: '学术研究人员', category: '学术', description: '集中展示论文、基金与教学经历', summary: '研究方向为人机交互与可视分析，拥有独立研究、论文发表、科研项目管理和本科教学经验。', skills: '- **研究：** 实验设计、统计分析、定性研究\n- **成果：** 论文、专利、科研基金、学术报告\n- **教学：** 课程设计、学生指导、公开课', achievement: '以第一作者发表 5 篇高水平论文，其中 2 篇获最佳论文提名', project: '国家自然科学基金青年项目' },
  { id: 'executive-resume', title: '企业高管', category: '领导力', description: '适合总监、副总裁与 C-level 岗位', summary: '拥有 15 年业务增长与组织领导经验，擅长制定战略、建设高绩效团队并推动跨区域业务转型。', skills: '- **战略：** 业务规划、市场进入、并购整合\n- **经营：** P&L、增长、运营效率、风险治理\n- **组织：** 高管团队、人才梯队、董事会沟通', achievement: '带领 300 人业务单元实现三年收入复合增长 42%，利润率提升 9 个百分点', project: '集团第二增长曲线战略' },
];

export const templates: ResumeTemplate[] = seeds.map((seed) => ({ ...seed, markdown: createMarkdown(seed) }));
export const quickTemplateIds = ['frontend-developer', 'fullstack-developer', 'devops-engineer', 'senior-engineer'];
export const templatesByLocale: Record<Locale, ResumeTemplate[]> = { zh: templates, en: englishTemplates };
export const getTemplates = (locale: Locale = 'zh') => templatesByLocale[locale];
export const getTemplate = (id: string, locale: Locale = 'zh') => getTemplates(locale).find((template) => template.id === id) ?? getTemplates(locale)[0];
