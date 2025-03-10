interface GetTopAlbumsResponse {
  topalbums: {
    album: {
      artist: {
        url: string,
        name: string,
        mbid: string
      },
      image: {
        size: "small" | "medium" | "large" | "extralarge",
        "#text": string
      }[],
      mbid: string,
      url: string,
      playcount: string,
      "@attr": {
        rank: string
      },
      name: string
    }[],
    "@attr": {
      user: string,
      totalPages: string,
      page: string,
      total: string,
      perPage: string
    }
  }
}