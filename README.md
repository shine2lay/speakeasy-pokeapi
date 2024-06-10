# PokeApi - Sdk - Speakeasy
This repo contains a very simple typescript sdk that can call two endpoints from pokeapi

`https://pokeapi.co/api/v2/pokemon/{id or name}/`
`https://pokeapi.co/api/v2/generation/{id or name}/`

for further details into the api, use this link: https://pokeapi.co/docs/v2#pokemon

## Installation
install this repo as a module
```shell
yarn add '<this-github-repo-url>'
```
## Usage
You'll first create an instance of PokeApi

```typescript
import {PokeApi} from '<this-github-repo-url>';


const main = async () => {
    const pokeApi = new PokeApi({
        baseUrl: 'https://pokeapi.co/api/v2',
        retry: {
            maxRetries: 3,
            retryDelay: 1000,
            retryDelayFactor: 2,
        },
        logLevel: 'info',
    }) // note this is the default values

    const response = await pokeApi.api.Pokemon.get('pikachu')
    
}

main()
```


### Local Development
clone the repo and run
```shell
yarn install
```

### Testing
```shell
yarn test
```

### Linting
```shell
yarn lint
```

### Building
```shell
yarn build
```

### Endpoints
We have two available endpoints
`https://pokeapi.co/api/v2/pokemon/{id or name}/`
`https://pokeapi.co/api/v2/generation/{id or name}/`

they are only available as `get` and `list`
```typescript
pokeApi.api.Pokemon.get('pikachu' /* nameOrId */)
pokeApi.api.Pokemon.list(0 /* offset */, 20 /* limit */)

pokeApi.api.Generation.get(1 /* nameOrId */)
pokeApi.api.Generation.list(0 /* offset */, 20 /* limit */) 
```

## Design Decisions
I will only mention relevant high level designs and thinking in this section.

### Singleton Class / One Instance
I implemented the main exported class of PokeApi as a singleton allowing users to be able to import and use the same instance from anywhere in their codebase.
A few reasons behind this: 
- Allow one single point of entry thus easier to make sure configuration and other data passed in is consistent
- If the sdk later implement web sockets, we can make sure there is only one connection
- Make sure cache and other resources are properly created and utilized.

### Code and Folder structure
Although, we only have two endpoint in this particular case, I wanted to at least set up a structure that would allow new endpoints to be added relatively easily.
With the current structure, we should also be able to extend websocket and other connection type capability in a relatively straight forward manner.

### Abstraction - Amalgamation 
I did spend some time trying to think of ways we can potentially abstract / combine concepts to make it easier for devs to use.
However, I did end up ultimately deciding to just straight forward approach of naming and calling the endpoints as they were designed in pokeapi.
There are a few reasons for this:
- This one is stemming from my personal experiences. When I am looking up api docs and if the API function call name is different from the endpoint described, It gets very confusing.
- The api end points seems very straightforward, I had a hard time trying to think of abstractions that would make sense from a logical perspective. Which could also be because I don't know the intended users and their use cases for this specific sdk.

### Logging && Caching
I wanted to point out two tools/lib (aside from typical typescript scaffolding) I am utilizing
- Pino Logger[https://getpino.io/#/]
- Axios-cache-interceptor[https://axios-cache-interceptor.js.org/]

I chose Pino because it's easy to set up and allow easy configuration to know which level of logs to be viewed.
The default is `info` but you can choose any level from 
```
'debug'
'error'
'info'
'warn'
'fatal'
```

axios-cache-interceptor is a light-weight `In-memory/Local Storage` Cache. Which would be more than sufficient for purposes of this small sdk.


## Potential Improvements
### Pagination
I implemented a straight forward version of pagination with offset and limit, but I think it might be nice
if I could return the result of a query with an object that have `next()` function that will automatically fetch next page.
It could be useful to not have to track the offsets. 

### Abstraction 
Depending on the user and use cases, It might be nice to extract out abstractions such as
```
Pokemon.getByAbilities()
Pokemon.getByMoves()
Pokemon.getByType()
Pokemon.get('pikachu').getEvolutions()

Games.getByGeneration()
Games.getByYearReleased()

Item('potion').cost()
Item.getAllByGeneration()
```

I think this could be helpful if the use cases for easily grab related items / events. But it will definitely requires more 
endpoints than the two required for this repo.


