import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PokeApiResponse } from './interfaces/poke-response.interface';
import { catchError, firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';


@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly httpService: HttpService
  ) { }

  async executeSeed() {
    try {
      const { data } = await this.httpService.axiosRef.get('https://pokeapi.co/api/v2/pokemon?limit=650', {
        headers: { "Accept-Encoding": "gzip,deflate,compress" }
      })

      const results = data.results.map(pokemon => {
        const segments = pokemon.url.split('/');
        const no = +segments[segments.length-2];

        return {
          name: pokemon.name,
          no
        };

      })

      await this.pokemonModel.deleteMany();

      await this.pokemonModel.insertMany(results)
      
      return 'Seed executed';

    } catch (error) {
      console.log(error)
    }

  }
}
