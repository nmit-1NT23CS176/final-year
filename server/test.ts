import yahooFinance from 'yahoo-finance2';
async function test() {
  try {
    const quote = await yahooFinance.quote('RELIANCE.NS');
    console.log(quote.regularMarketPrice);
  } catch (err) {
    console.error(err);
  }
}
test();
