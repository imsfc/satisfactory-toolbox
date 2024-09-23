import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AddOutlined',
  setup() {
    return () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 24 24"
      >
        <path
          d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
          fill="currentColor"
        ></path>
      </svg>
    )
  },
})
