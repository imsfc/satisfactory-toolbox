import buildings from '../data/buildings.json'
import items from '../data/items.json'
import projectAssemblyPhases from '../data/project-assembly-phases.json'

const pages = new Map<string, string>()

// 建筑
{
  let content = '# 建筑\n'
  {
    const categories = new Set<string>()
    buildings.forEach(({ category }) => {
      categories.add(category)
    })
    for (const category of categories) {
      content += `\n## ${category}\n`
      buildings
        .filter((building) => building.category === category)
        .forEach(({ name, description }) => {
          content += `\n### ${name}\n`
          content += `\n${description.replace(/\n/g, '  \n')}\n`
        })
    }
  }
  console.log(content)
  pages.set('buildings', content)
}

// 物品
{
  let content = '# 物品\n'
  {
    const categories = new Set<string>()
    items.forEach(({ category }) => {
      categories.add(category)
    })
    for (const category of categories) {
      content += `\n## ${category}\n`
      items
        .filter((building) => building.category === category)
        .forEach(({ name, description }) => {
          content += `\n### ${name}\n`
          content += `\n${description.replace(/\n+/, '\n\n')}\n`
        })
    }
  }
  pages.set('items', content)
}

// 项目组装阶段
{
  let content = '# 项目组装阶段\n'
  projectAssemblyPhases.forEach(({ phase, name, cost, deliveryUnlocks }) => {
    content += `\n## 阶段 ${phase}：${name}\n`
    content += `\n解锁：${deliveryUnlocks}\n`
    content += '\n需要：\n'
    cost.forEach(({ itemName, quantity }) => {
      content += `- ${quantity} × ${itemName}\n`
    })
  })
  pages.set('project-assembly-phases', content)
}

export default {
  paths() {
    return Array.from(pages.keys()).map((page) => {
      const content = pages.get(page)
      return {
        params: { page },
        content,
      }
    })
  },
}
