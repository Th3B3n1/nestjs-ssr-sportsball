import { Injectable } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from 'src/prisma.service';
import { Team } from '@prisma/client';

@Injectable()
export class TeamsService {
    constructor(private prismaService: PrismaService) { }
    async create(createTeamDto: CreateTeamDto) {
        try {
            return await this.prismaService.team.create({
                data: createTeamDto,
            });
        }
        catch (e) {
            switch (e.code) {
                case 'P2002':
                    throw new HttpErrorByCode[409]('Player already exists');
                default:
                    throw new HttpErrorByCode[400]('Invalid input');
            }
        }
    }

    async addPlayer(id: number, playerId: number) {
        try {
            return await this.prismaService.team.update({
                where: {
                    id: id,
                },
                data: {
                    players: {
                        connect: {
                            id: playerId,
                        },
                    },
                },
            });
        }
        catch (e) {
            switch (e.code) {
                case 'P2015':
                    throw new HttpErrorByCode[404]('Player not found');
                default:
                    throw new HttpErrorByCode[400]('Invalid input');
            }
        }
    }

    async findAll(): Promise<Team[]> {
        try {
            return await this.prismaService.team.findMany();
        }
        catch (e) {
            throw new HttpErrorByCode[500]('Internal server error'); 
        }
    }

    async findAllWithPlayers(): Promise<Team[]> {
        try {
            return await this.prismaService.team.findMany({
                include: {
                    players: true,
                },
            });
        }
        catch (e) {
            throw new HttpErrorByCode[500]('Internal server error'); 
        }
    }

    async findOne(id: number): Promise<Team | null> {
        try {
            return await this.prismaService.team.findFirst({
                where: {
                    id: id,
                },
            });
        }
        catch (e) {
            switch (e.code) {
                case 'P2015':
                    throw new HttpErrorByCode[404]('Player not found');
                default:
                    throw new HttpErrorByCode[400]('Invalid input');
            }
        }
    }

    async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
        try {
            return await this.prismaService.team.update({
                where: {
                    id: id,
                },
                data: updateTeamDto,
            });
        }
        catch (e) {
            switch (e.code) {
                case 'P2015':
                    throw new HttpErrorByCode[404]('Player not found');
                default:
                    throw new HttpErrorByCode[400]('Invalid input');
            }
        }
    }

    async remove(id: number): Promise<Team> {
        try {
            return await this.prismaService.team.delete({
                where: {
                    id: id,
                },
            });
        }
        catch (e) {
            switch (e.code) {
                case 'P2015':
                    throw new HttpErrorByCode[404]('Player not found');
                default:
                    throw new HttpErrorByCode[400]('Invalid input');
            }
        }
    }
}
