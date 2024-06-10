import { dealBlacklist, getFirstPageNo } from './_util'
import store from '@/store'
import { isBooruSite, searchBooru } from '@/api/booru'
import { fetchPostsByPath, isPoolShowPage, isPopularPage } from '@/api/moebooru'
import { fetchRule34Favorites, isRule34FavPage } from '@/api/rule34'
import { fetchGelbooruFavorites, isGelbooruFavPage } from '@/api/gelbooru'
import { fetchEshuushuuPosts, isEshuushuuPage } from '@/api/e-shuushuu'
import { fetchZerochanPosts, isZerochanPage } from '@/api/zerochan'
import { fetchSankakuPosts, isSankakuPage } from '@/api/sankaku'
import { fetchSankakuAIPosts, isSankakuAIPage } from '@/api/sankaku-ai'
import { fetchSankakuIdolPosts, isSankakuIdolPage } from '@/api/sankaku-idol'
import { fetchAnimePicturesPosts, isAnimePicturesPage } from '@/api/anime-pictures'
import { fetchAllGirlPosts, isAllGirlPage } from '@/api/all-girl'
import { fetchHentaiBooruPosts, isHentaiBooruPage } from '@/api/hentaibooru'
import { fetchKusowankaPosts, isKusowankaPage } from '@/api/kusowanka'
import { fetchAnihonetwallpaperPosts, isAnihonetwallpaperPage } from '@/api/anihonetwallpaper'
import { fetchNozomiPosts, isNozomiPage } from '@/api/nozomi.js'

const params = new URLSearchParams(location.search)
const query = {
  page: getFirstPageNo(params),
  tags: params.get('tags'),
}
export const getSearchState = () => query
export const setPage = (p: number) => query.page = p
export const setTags = (t: string) => query.tags = t

export const fetchActions = [
  {
    test: isPopularPage,
    action: async () => {
      const results = await fetchPostsByPath()
      store.requestStop = true
      return dealBlacklist(results)
    },
  },
  {
    test: isPoolShowPage,
    action: async () => {
      const results = await fetchPostsByPath('posts', query.page)
      return query.tags ? results.tagged(query.tags) : results
    },
  },
  {
    test: isGelbooruFavPage,
    action: async () => {
      const results = await fetchGelbooruFavorites(query.page)
      return dealBlacklist(results as any)
    },
  },
  {
    test: isRule34FavPage,
    action: async () => {
      const results = await fetchRule34Favorites(query.page)
      return dealBlacklist(results as any)
    },
  },
  {
    test: isBooruSite,
    action: async () => {
      const results = await searchBooru(query.page, query.tags)
      return dealBlacklist(results)
    },
  },
  {
    test: isEshuushuuPage,
    action: async () => {
      const results = await fetchEshuushuuPosts(query.page)
      return dealBlacklist(results as any)
    },
  },
  {
    test: isZerochanPage,
    action: async () => {
      const results = await fetchZerochanPosts(query.page)
      return dealBlacklist(results as any)
    },
  },
  {
    test: isAnimePicturesPage,
    action: async () => {
      const results = await fetchAnimePicturesPosts(query.page, query.tags)
      return dealBlacklist(results as any)
    },
  },
  {
    test: isAllGirlPage,
    action: async () => {
      const results = await fetchAllGirlPosts(query.page, query.tags)
      return dealBlacklist(results as any)
    },
  },
  {
    test: isHentaiBooruPage,
    action: async () => {
      const results = await fetchHentaiBooruPosts(query.page, query.tags)
      return dealBlacklist(results as any)
    },
  },
  {
    test: isKusowankaPage,
    action: async () => {
      const results = await fetchKusowankaPosts(query.page)
      return dealBlacklist(results as any)
    },
  },
  {
    test: isAnihonetwallpaperPage,
    action: async () => {
      const results = await fetchAnihonetwallpaperPosts(query.page)
      return dealBlacklist(results as any)
    },
  },
  {
    test: isNozomiPage,
    action: async () => {
      const results = await fetchNozomiPosts(query.page)
      return dealBlacklist(results as any)
    },
  },
  {
    test: isSankakuIdolPage,
    action: async () => {
      const results = await fetchSankakuIdolPosts(query.page, query.tags)
      return dealBlacklist(results as any)
    },
  },
  {
    test: isSankakuPage,
    action: async () => {
      const results = await fetchSankakuPosts(query.page, query.tags)
      return dealBlacklist(results as any)
    },
  },
  {
    test: isSankakuAIPage,
    action: async () => {
      const results = await fetchSankakuAIPosts(query.page, query.tags)
      return dealBlacklist(results as any)
    },
  },
  {
    test: () => true,
    action: async () => [],
  },
]
