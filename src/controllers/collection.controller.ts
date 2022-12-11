import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Collection} from '../models';
import {CollectionRepository} from '../repositories';
import { ContractsService } from '../services';

export class CollectionController {
  constructor(
    @repository(CollectionRepository)
    public collectionRepository : CollectionRepository,
    @service(ContractsService)
    private contractService: ContractsService
  ) {}


  @post('/collections')
  @response(200, {
    description: 'Collection model instance',
    content: {'application/json': {schema: getModelSchemaRef(Collection)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Collection, {
            title: 'NewCollection',
            exclude: ['id'],
          }),
        },
      },
    })
    collection: Omit<Collection, 'id'>,
  ): Promise<Collection> {
    return this.collectionRepository.create(collection);
  }

  @get('/collections')
  @response(200, {
    description: 'Array of Collection model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Collection, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Collection) filter?: Filter<Collection>,
  ): Promise<Collection[]> {
    return this.collectionRepository.find(filter);
  }

  @patch('/collections')
  @response(200, {
    description: 'Collection PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Collection, {partial: true}),
        },
      },
    })
    collection: Collection,
    @param.where(Collection) where?: Where<Collection>,
  ): Promise<Count> {
    return this.collectionRepository.updateAll(collection, where);
  }

  @get('/collections/{id}')
  @response(200, {
    description: 'Collection model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Collection, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Collection, {exclude: 'where'}) filter?: FilterExcludingWhere<Collection>
  ): Promise<Collection> {
    return this.collectionRepository.findById(id, filter);
  }

  @patch('/collections/{id}')
  @response(204, {
    description: 'Collection PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Collection, {partial: true}),
        },
      },
    })
    collection: Collection,
  ): Promise<void> {
    await this.collectionRepository.updateById(id, collection);
  }

  @del('/collections/{id}')
  @response(204, {
    description: 'Collection DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.collectionRepository.deleteById(id);
  }
}
