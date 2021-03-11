const asyncFn = () => {
  return Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123)
    }, 100)
  })
}

const fn = async () => {
  let res = await asyncFn();
  console.log(res, '----res')
}

fn()