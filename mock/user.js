const mockData = [
  {
    url: '/api/user',
    method: 'GET',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          name: 'John Doe',
          age: 30,
        },
      }
    },
  },
]

export default mockData
