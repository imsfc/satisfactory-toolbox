import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DragHandleOutlined',
  setup() {
    return () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 24 24"
      >
        <path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" fill="currentColor"></path>
      </svg>
    )
  },
})
