import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Address } from './address.schema'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'
import { User } from '../user/user.schema'

@Injectable()
export class AddressService {
    constructor(
        @InjectModel(Address.name) private addressModel: Model<Address>,
        @InjectModel(User.name) private userModel: Model<User>
    ) {}

    async findAll(userId: string) {
        return this.addressModel.find({ userId })
    }

    async findById(userId: string, id: string) {
        const address = await this.addressModel.findOne({ _id: id, userId })
        if (!address) throw new NotFoundException('Address not found')
        return address
    }

    async create(userId: string, dto: CreateAddressDto) {
        if (dto.isDefault) {
            await this.addressModel.updateMany({ userId }, { isDefault: false })
        }
        const address = await this.addressModel.create({ ...dto, userId })
        await this.userModel.findByIdAndUpdate(userId, {
            $push: { addresses: address._id },
            ...(dto.isDefault && { defaultAddressId: address._id }),
        })
        return address
    }

    async update(userId: string, id: string, dto: UpdateAddressDto) {
        const address = await this.addressModel.findOneAndUpdate({ _id: id, userId }, dto, { new: true })
        if (!address) throw new NotFoundException('Address not found')
        return address
    }

    async remove(userId: string, id: string) {
        const user = await this.userModel.findById(userId)
        if (user.defaultAddressId?.toString() === id) {
            throw new BadRequestException('Cannot delete default address. Please change the default address first.')
        }
        const address = await this.addressModel.findOneAndDelete({ _id: id, userId })
        if (!address) throw new NotFoundException('Address not found')
        await this.userModel.findByIdAndUpdate(userId, { $pull: { addresses: id } })
        return { message: 'Address deleted' }
    }

    async setDefault(userId: string, id: string) {
        const address = await this.addressModel.findOne({ _id: id, userId })
        if (!address) throw new NotFoundException('Address not found')

        // ✅ Wait for all old defaults to be unset
        await this.addressModel.updateMany({ userId }, { isDefault: false })

        // ✅ Then set this one to true
        await this.addressModel.findByIdAndUpdate(id, { isDefault: true })

        // ✅ Finally update the user’s default reference
        await this.userModel.findByIdAndUpdate(userId, { defaultAddressId: id })

        return this.addressModel.findById(id) // Return updated address if needed
    }
}
