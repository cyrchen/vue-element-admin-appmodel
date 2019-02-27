/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const tableRouter = {
  path: '/test1',
  component: Layout,
  redirect: '/test1/t5',
  name: 'T',
  meta: {
    title: 'test1',
    icon: 'table'
  },
  children: [
    {
      path: 't1',
      component: () => import('@/views/table/dynamicTable/index'),
      name: 't1',
      meta: { title: 't1' }
    },
    {
      path: 't2',
      component: () => import('@/views/table/dragTable'),
      name: 'DragTable',
      meta: { title: 'dragTable' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/table/inlineEditTable'),
      name: 'InlineEditTable',
      meta: { title: 'inlineEditTable' }
    },
    {
      path: 'tree-table',
      component: () => import('@/views/table/treeTable/treeTable'),
      name: 'TreeTableDemo',
      meta: { title: 'treeTable' }
    },
    {
      path: 'custom-tree-table',
      component: () => import('@/views/table/treeTable/customTreeTable'),
      name: 'CustomTreeTableDemo',
      meta: { title: 'customTreeTable' }
    },
    {
      path: 't5',
      component: () => import('@/views/table/complexTable'),
      name: 'ComplexTable',
      meta: { title: 'complexTable' }
    }
  ]
}
export default tableRouter
