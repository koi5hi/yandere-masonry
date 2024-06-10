export function isSankakuIdolPage() {
  return location.hostname == 'idol.sankakucomplex.com'
}

const state: {
  base: string
  nextUrl?: string | null
} = {
  base: 'https://idol.sankakucomplex.com/cn/posts?auto_page=t',
  nextUrl: null,
}
const ratingMap: Record<string, string> = {
  'G': 's',
  'R15+': 'q',
  'R18+': 'e',
}

export async function fetchSankakuIdolPosts(page: number, tags: string | null) {
  if (page == 1) state.nextUrl = null
  const url = new URL(state.nextUrl ? `https://idol.sankakucomplex.com${state.nextUrl}` : state.base)
  url.searchParams.set('auto_page', 't')
  !state.nextUrl && tags && url.searchParams.set('tags', tags)
  const htmlResp = await fetch(url.href)
  const doc = new DOMParser().parseFromString(await htmlResp.text(), 'text/html')
  state.nextUrl = doc.querySelector<HTMLElement>('body > div[next-page-url]')?.getAttribute('next-page-url')
  const results = [...doc.querySelectorAll('.post-gallery .post-preview')].map(el => {
    const id = el.getAttribute('data-id')
    const img = el.querySelector('img')
    const tagsText = img?.getAttribute('data-auto_page') || ''
    const tagsArr = tagsText.split(/\s/) || []
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, width, height] = tagsText.match(/Size:(\d+)x(\d+)/) || []
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [__, ratingText] = tagsText.match(/Rating:(\S+)/) || []
    return {
      id,
      postView: el.querySelector<HTMLAnchorElement>('a')?.href,
      previewUrl: img?.src,
      fileUrl: '',
      tags: tagsArr,
      width: Number(width),
      height: Number(height),
      aspectRatio: Number(width) / Number(height),
      fileExt: el.querySelector('.animated_details') ? 'mp4' : 'jpg',
      fileDownloadName: `sankaku-idol ${id} ${tagsArr.join(' ')}`,
      fileDownloadText: `${width}×${height}`,
      rating: ratingMap[ratingText] || ratingText,
    } as any
  })
  return results
}

export async function getSankakuIdolDetail(id: string) {
  const url = new URL(`https://idol.sankakucomplex.com/cn/posts/${id}`)
  const htmlResp = await fetch(url.href)
  const doc = new DOMParser().parseFromString(await htmlResp.text(), 'text/html')
  const imgSrc = doc.querySelector<HTMLImageElement>('#post-content img')?.src
  const fileUrl = doc.querySelector<HTMLAnchorElement>('#post-content a')?.href
  const videoSrc = doc.querySelector<HTMLMediaElement>('#post-content video')?.src
  return {
    sampleUrl: imgSrc,
    fileUrl: fileUrl || imgSrc || videoSrc,
  }
}
