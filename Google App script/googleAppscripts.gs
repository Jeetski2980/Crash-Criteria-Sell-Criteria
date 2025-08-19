const ALPHA_API_KEY = "FZQ7NMPM8KD0JK6F";
const TWELVE_API_KEY = "24af32924ae0403dae2dc943f062b148";
const EMAIL = "jeetanil28@gmail.com";

function checkSPYBuySellSignal() {
  const data = fetchSPYData();
  if (!data) return;

  const closes = data.map(d => parseFloat(d.close));
  const volumes = data.map(d => parseFloat(d.volume));

  const signals = {
    buy: checkBuySignal(closes, volumes),
    sell: checkSellSignal(closes)
  };

  if (signals.buy) {
    MailApp.sendEmail(EMAIL, "🟢 SPY BUY Signal Triggered", "The BUY signal has been triggered today based on crash detection rules.");
  }

  if (signals.sell) {
    MailApp.sendEmail(EMAIL, "🔴 SPY SELL Signal Triggered", "The SELL signal has been triggered today based on euphoric rebound rules.");
  }
}

function fetchSPYData() {
  const alphaURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=SPY&outputsize=full&apikey=${ALPHA_API_KEY}`;
  try {
    const res = UrlFetchApp.fetch(alphaURL);
    const json = JSON.parse(res.getContentText());
    const series = json["Time Series (Daily)"];
    if (!series) throw new Error("Alpha Vantage failed");

    const sorted = Object.keys(series).sort().reverse();
    return sorted.slice(0, 520).map(date => ({
      date,
      close: series[date]["4. close"],
      volume: series[date]["6. volume"]
    }));
  } catch (e) {
    Logger.log("Alpha Vantage failed, using Twelve Data...");
    return fetchFromTwelveData();
  }
}

function fetchFromTwelveData() {
  const url = `https://api.twelvedata.com/time_series?symbol=SPY&interval=1day&outputsize=520&apikey=${TWELVE_API_KEY}`;
  const res = UrlFetchApp.fetch(url);
  const json = JSON.parse(res.getContentText());
  if (!json.values) {
    Logger.log("Twelve Data failed too");
    return null;
  }
  return json.values.map(d => ({
    date: d.datetime,
    close: d.close,
    volume: d.volume
  }));
}

function checkBuySignal(closes, volumes) {
  const max12 = Math.max(...closes.slice(0, 12));
  const drop6 = (closes[0] - max12) / max12 * 100 <= -6;

  const dailyDrops = closes.map((c, i) => i === 0 ? 0 : (c - closes[i - 1]) / closes[i - 1] * 100);
  const drop3 = dailyDrops.slice(1, 13).filter(p => p <= -3).length >= 1;
  const drop175 = dailyDrops.slice(1, 15).filter(p => p <= -1.75).length >= 2;

  const vol14 = average(volumes.slice(0, 14));
  const vol30 = average(volumes.slice(0, 30));
  const spike = vol14 >= 1.15 * vol30;

  return drop6 && drop3 && drop175 && spike;
}

function checkSellSignal(closes) {
  const low20 = Math.min(...closes.slice(1, 21));
  const rebound6 = (closes[0] - low20) / low20 * 100 >= 6;

  const dailyGains = closes.map((c, i) => i === 0 ? 0 : (c - closes[i - 1]) / closes[i - 1] * 100);
  const gain3 = dailyGains.slice(1, 16).some(p => p >= 3);
  const gain175 = dailyGains.slice(1, 11).some(p => p >= 1.75);

  const low60 = Math.min(...closes.slice(0, 60));
  const above12w = (closes[0] - low60) / low60 * 100 >= 8;

  const high500 = Math.max(...closes.slice(1, 501));
  const breakout = closes[0] > high500;

  return rebound6 && gain3 && gain175 && above12w && breakout;
}

function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
