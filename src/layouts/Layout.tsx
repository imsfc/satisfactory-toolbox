import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { NLayout, NLayoutHeader, NLayoutContent, NText } from 'naive-ui'

import logo from '@/assets/logo.png'

export default defineComponent({
  setup() {
    return () => (
      <NLayout style={{ height: '100vh' }}>
        <NLayoutHeader
          style={{
            padding: '0 32px',
            height: '64px',
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '240px 1fr auto',
          }}
          bordered
        >
          <NText
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: 1,
            }}
          >
            <img
              style={{ marginRight: '12px', width: '32px', height: '32px' }}
              src={logo}
            />
            <span>幸福工厂小助手</span>
          </NText>
          <div></div>
          <div>
            <NText>v0.11</NText>
          </div>
        </NLayoutHeader>

        <NLayoutContent
          style={{
            top: '64px',
            bottom: '0',
          }}
          content-style="padding: 24px 32px"
          position="absolute"
          nativeScrollbar={false}
        >
          <RouterView />
        </NLayoutContent>
      </NLayout>
    )
  },
})
