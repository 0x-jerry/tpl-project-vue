import { mount } from '@vue/test-utils'
import Counter from '../Counter.vue'

test('mount component', async () => {
  expect(Counter).toBeTruthy()

  const wrapper = mount(Counter, {
    props: {
      modelValue: 4,
    },
  })

  expect(wrapper.find('span').text()).toContain('4')
  expect(wrapper.html()).toMatchSnapshot()
})
