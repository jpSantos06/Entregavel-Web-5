# Por que Promise.all pode ser mais rápido que vários await seguidos?


Quando usamos vários await de forma sequencial, cada Promise precisa terminar antes que a próxima requisição seja iniciada. Isso faz com que o tempo de espera das requisições seja somado.

Por exemplo:

const resultado1 = await fetch(url1);
const resultado2 = await fetch(url2);
const resultado3 = await fetch(url3);


Nesse caso, url2 só começa a ser requisitada depois que url1 terminar, e url3 só começa depois que url2 terminar.

Já com Promise.all, as requisições são iniciadas em paralelo:

const [resultado1, resultado2, resultado3] = await Promise.all([
  fetch(url1),
  fetch(url2),
  fetch(url3)
]);


Assim, todas as requisições são disparadas praticamente ao mesmo tempo, e o código espera que todas terminem. Por isso, quando as requisições são independentes, Promise.all pode ser mais rápido, pois aproveita melhor o tempo de rede em vez de esperar cada requisição individualmente.

Em resumo: await sequencial executa as requisições uma após a outra, enquanto Promise.all permite executá-las em paralelo e aguardar todas juntas.
