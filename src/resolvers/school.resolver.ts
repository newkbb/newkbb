import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { ForbiddenError } from 'apollo-server-core'

import { School } from '@entities'
import { CreateScoolInput } from '../generator/graphql.schema'

@Resolver('School')
export class SchoolResolver {
	@Query()
	async schools(): Promise<School[]> {
		return getMongoRepository(School).find({
			cache: true
		})
	}

	@Mutation()
	async createCity(@Args('input') input: CreateScoolInput): Promise<School> {
		const { name } = input

		const schools = await getMongoRepository(School).findOne({ name })

		if (schools) {
			throw new ForbiddenError('School already existed.')
		}

		return await getMongoRepository(School).save(new School({ ...input }))
	}
}
