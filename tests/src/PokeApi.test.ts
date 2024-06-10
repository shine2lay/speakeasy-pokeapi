import {PokeApi} from "../../src/PokeApi";
import {Generation} from "../../src/api/Generation";
import {Pokemon} from "../../src/api/Pokemon";
import nock from "nock";

// These are integration tests, so we need to mock the network requests
describe('PokeApi Tests', () => {
    test('should correctly merge provided configuration', () => {
        const customConfig = {
            logLevel: 'fatal',
        };
        const pokeApi = new PokeApi(customConfig);
        expect(pokeApi.config.logLevel).toBe(customConfig.logLevel);
    });

    test('should return the same instance', () => {
        const instance1 = new PokeApi();
        const instance2 = new PokeApi();
        expect(instance1).toBe(instance2);
    });

    test('should initialize Generation and Pokemon endpoints', () => {
        const pokeApi = new PokeApi();
        expect(pokeApi.api.generation).toBeInstanceOf(Generation);
        expect(pokeApi.api.pokemon).toBeInstanceOf(Pokemon);
    });

    test('should initialize logger', () => {
        const pokeApi = new PokeApi();
        expect(pokeApi.logger).toBeDefined();
    });
});

describe('PokeApi API Call Handling Tests', () => {
    beforeAll(() => {
        nock('https://pokeapi.co/api/v2')
            .get('/pokemon/1')
            .reply(200, { name: 'bulbasaur', height: 7, weight: 69 });

        nock('https://pokeapi.co/api/v2')
            .get('/generation/1')
            .reply(200, { results: { id: 1, name: 'generation-i' } });

        nock('https://pokeapi.co/api/v2')
            .get('/pokemon/?offset=0&limit=20')
            .reply(200, { results: [{name: 'pikachu', height: 3, weight: 42}, { name: 'bulbasaur', height: 7, weight: 69 }]});

        nock('https://pokeapi.co/api/v2')
            .get('/generation/?offset=0&limit=20')
            .reply(200, { results: [{ id: 2, name: 'generation-ii' }, { id: 1, name: 'generation-i' }] });
    });

    afterAll(() => {
        nock.cleanAll();
    });

    test('should fetch Pokemon by name', async () => {
        const pokeApi = new PokeApi();
        const response = await pokeApi.api.pokemon.get(1);
        expect(response.name).toBe('bulbasaur');
    });
    test('should fetch Pokemon list', async () => {
        const pokeApi = new PokeApi();
        const response = await pokeApi.api.pokemon.list();
        expect(response.results.length).toBe(2);
    });

    test('should fetch Generations by id', async () => {
        const pokeApi = new PokeApi();
        const response = await pokeApi.api.generation.get(1);
        expect(response.results.name).toBe('generation-i');
    });

    test('should fetch Generation list', async () => {
        const pokeApi = new PokeApi();
        const response = await pokeApi.api.generation.list();
        expect(response.results.length).toBe(2);
    });
});
