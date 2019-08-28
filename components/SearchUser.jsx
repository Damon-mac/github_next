import { useState, useCallback, useRef } from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'

import api from '../lib/api'

const Option = Select.Option

function SearchUser({ onChange, value }) {
  // 可以避免闭包陷阱, 使用useRef返回的值永远是{ current: 0 }, 只是current的值是会变的
  const lastFetchIdRef = useRef(0)
  // 不管SearchUser方法执行多少遍, useState返回的设置方法是不会变的
  // 所以即使把这两个方法作为依赖放进useCallback的数组里也是没关系的
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState([])

  // 这里useCallback因为只依赖上面两个方法, 而上面两个方法都是不会变的, 所以[]里写不写都可以
  const fetchUser = useCallback(
    debounce(value => {
      console.log('fetching user', value)

      lastFetchIdRef.current += 1
      const fetchId = lastFetchIdRef.current
      setFetching(true)
      // 先清空下拉选项
      setOptions([])

      api
        .request({
          url: `/search/users?q=${value}`,
        })
        .then(resp => {
          console.log('user:', resp)
          // 如果前一次请求还没返回第二次请求就开始的话前一次请求的返回值就不要了
          if (fetchId !== lastFetchIdRef.current) {
            return
          }
          const data = resp.data.items.map(user => ({
            text: user.login,
            value: user.login,
          }))

          setFetching(false)
          setOptions(data)
        })
    }, 1000),
    [],
  )

  const handleChange = value => {
    setOptions([])
    setFetching(false)
    onChange(value)
  }

  return (
    <Select
      style={{ width: 200 }}
      showSearch={true}
      notFoundContent={fetching ? <Spin size="small" /> : <span>nothing</span>}
      filterOption={false}
      placeholder="创建者"
      value={value}
      onChange={handleChange}
      onSearch={fetchUser}
      allowClear={true}
    >
      {options.map(op => (
        <Option value={op.value} key={op.value}>
          {op.text}
        </Option>
      ))}
    </Select>
  )
}

export default SearchUser
