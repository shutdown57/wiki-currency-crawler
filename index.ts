import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs/promises'

const url = 'https://fa.wikipedia.org/wiki/%D9%81%D9%87%D8%B1%D8%B3%D8%AA_%D8%A7%D8%B1%D8%B2%D9%87%D8%A7%DB%8C_%D8%AF%D8%B1_%DA%AF%D8%B1%D8%AF%D8%B4'

type Row = {
  country: string
  currency: string
  symbol: string
  iso: string
  fractionalUnit: string
}

try {
  const { data } = await axios.get(url)
  const $Ch = cheerio.load(data)
  const result = new Array()
  const re = new RegExp(/(\[.*\])+/, 'i')
  $Ch('table.sortable tbody tr').each((i, e) => {
    if ($Ch(e).children().toArray().length > 6) {
      return
    }
    if (i === 0) {
      return
    }

    const row: Row = {
      country: '',
      currency: '',
      symbol: '',
      iso: '',
      fractionalUnit: ''
    }
    $Ch(e).children().each((index, element) => {
      switch (index) {
        case 0:
        row.country = $Ch(element).text().trim().replace(re, '')
        case 1:
        row.currency = $Ch(element).text().trim().replace(re, '')
        case 2:
        row.symbol = $Ch(element).text().trim().replace(re, '')
        case 3:
        row.iso = $Ch(element).text().trim().replace(re, '')
        case 4:
        row.fractionalUnit = $Ch(element).text().trim().replace(re, '')
      }
    })
    result.push(row)
  })
  const fileName = './currencies.json'
  const stringify = JSON.stringify(result)

  await fs.writeFile(fileName, stringify)
} catch (err) {
  console.error(err)
}

