import fs from 'fs'
// @ts-ignore
import clusters from 'webm-cluster-stream'

const cl = clusters()

export async function getWebmHeader(fileName: string) {
  return new Promise((resolve) => {
    cl.once('data', function (header: any) {
      resolve(header)
    })
    fs.createReadStream(fileName).pipe(cl)
  })
}
