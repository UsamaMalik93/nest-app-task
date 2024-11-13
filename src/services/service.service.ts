//all of the crud logic is here
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './service.schema';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServiceService {
  constructor(@InjectModel(Service.name) private serviceModel: Model<Service>) { }

  //to handle creating service
  async create(CreateServiceDto: CreateServiceDto): Promise<Service> {
    const newCreatedService = new this.serviceModel(CreateServiceDto)
    return newCreatedService.save();
  }
  async findAll(): Promise<{
    [x: string]: any; data: Service[], total: number
  }> {
    const services = await this.serviceModel.find().exec();
      const total = services.length;
  
    return { data: services, total };
  }
  

  //this will help us to fetch service by Id
  async findOne(id: string): Promise<Service> {
    const getServiceById = await this.serviceModel.findById(id).exec();
    if (!getServiceById)
      throw new NotFoundException(`Service ${id} not Found`)

    return getServiceById
  }

  //this will help to update a specific record by id
  async updatePartial(id: string, updateServiceDto: CreateServiceDto): Promise<Service> {
    const updatedService = await this.serviceModel.findByIdAndUpdate(
      id,
      updateServiceDto,  // Pass the fields that should be updated
      { new: true } // return the updated 
    );
    return updatedService;
  }

  //To delete a record by ID
  async remove(id: string): Promise<Service> {
    const deleteServiceById = await this.serviceModel.findByIdAndDelete(id).exec();
    if (!deleteServiceById)
      throw new NotFoundException(`Service with ID ${id} not found`);

    return deleteServiceById;
  }
}