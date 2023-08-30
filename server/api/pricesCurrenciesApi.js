const currenciesSearch = 'USD-BRL,EUR-BRL,BTC-BRL';

const CACHE_TIMEOUT = 30 * 60 * 1000; // 30 MINUTOS
const API_URL = `https://economia.awesomeapi.com.br/last/${currenciesSearch}`;

// Função para pegar as cotações das moedas
async function fetchExchangeRates() {
    try {
        console.log('Fetching exchange rates from API...');
        const response = await fetch(API_URL); // Usar fetch() para fazer a requisição HTTP
        const data = await response.json(); // Converte a resposta para JSON
        console.log('Exchange rates fetched:', data);
        return data;
    } catch (error) {
        console.error('Error fetching exchanges rates:', error.message);
        return null;
    }
}

// Função para atualizar os preços na tabela de acordo com a moeda
function updatePriceCells(rates, currency) {
    const currencyRate = rates[currency].bid;
    const starterPriceInUSD = 199.95;
    const goldPriceInUSD = 399.95;
    const diamondPriceInUSD = 999.95;

    const starterPriceInCurrency = (starterPriceInUSD * currencyRate).toFixed(2);
    const goldPriceInCurrency = (goldPriceInUSD * currencyRate).toFixed(2);
    const diamondPriceInCurrency = (diamondPriceInUSD * currencyRate).toFixed(2);

    document.getElementById('starter-price').textContent = `${currency} ${starterPriceInCurrency}`;
    document.getElementById('gold-price').textContent = `${currency} ${goldPriceInCurrency}`;
    document.getElementById('diamond-price').textContent = `${currency} ${diamondPriceInCurrency}`;
}

let currentCurrencyIndex = 0;
const currencies = ['USDBRL'];

// Função principal que chamará todas as outras
async function main() {
    const exchangeRates = await fetchExchangeRates();

    if (exchangeRates) {
        updatePriceCells(exchangeRates, currencies[currentCurrencyIndex]);
        currentCurrencyIndex = (currentCurrencyIndex + 1) % currencies.length;
    }
}

main();
setInterval(main, 15000);
