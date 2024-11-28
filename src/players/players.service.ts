import { Injectable } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from 'src/prisma.service';
import { Player } from '@prisma/client';

@Injectable()
export class PlayersService {
    constructor(private prismaService: PrismaService) { }
    async create(createPlayerDto: CreatePlayerDto) {
        try {
            return await this.prismaService.player.create({
                data: createPlayerDto,
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

    async findAll(select: {
        id: boolean,
        name: boolean,
        goalCount: boolean,
        birthDate: boolean,
        teamId: boolean,
    } = {
        id: false,
        name: true,
        goalCount: true,
        birthDate: true,
        teamId: true,
    }): Promise<Player[]> {
        try
        {
            return await this.prismaService.player.findMany({
                select: select,
            });
        }
        catch (e) {
            throw new HttpErrorByCode[500]('Internal server error'); 
        }
    }

    async findOne(id: number): Promise<Player | null> {
        try
        {
            return await this.prismaService.player.findFirst({
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

    async update(id: number, updatePlayerDto: UpdatePlayerDto) {
        try
        {
            return await this.prismaService.player.update({
                where: {
                    id: id,
                },
                data: updatePlayerDto,
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

    async remove(id: number) {
        try
        {
            return await this.prismaService.player.delete({
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
