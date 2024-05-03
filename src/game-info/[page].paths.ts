import projectAssemblyPhases from '../data/project-assembly-phases.json'

let projectAssemblyPhasesContent = '# 项目组装阶段'
projectAssemblyPhases.forEach(({ phase, name, cost, deliveryUnlocks }) => {
  projectAssemblyPhasesContent += `\n## 阶段 ${phase}：${name}\n`
  projectAssemblyPhasesContent += `\n解锁：${deliveryUnlocks}\n`
  projectAssemblyPhasesContent += '\n需要：\n'
  cost.forEach(({ itemName, quantity }) => {
    projectAssemblyPhasesContent += `- ${quantity} × ${itemName}\n`
  })
})

export default {
  paths() {
    return [
      {
        params: { page: 'project-assembly-phases' },
        content: projectAssemblyPhasesContent,
      },
    ]
  },
}
