import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package } from './package.schema';
import { CreatePackageDto } from './dto/create.package.dto';
import { ServiceService } from '../services/service.service';

@Injectable()
export class PackageService {
  constructor(
    @InjectModel(Package.name) private packageModel: Model<Package>,
    private serviceService: ServiceService,
  ) {}

  //for creating a package with service
  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const { services: serviceNames, ...packageData } = createPackageDto;
    const newPackage = new this.packageModel({
      ...packageData,
      services: serviceNames,
    });
  
    return newPackage.save();
  }

  async findAll(): Promise<{ data: Package[], total: number }> {
    const packages = await this.packageModel
      .find()
      .populate({
        path: 'services',  
        select: 'name', 
      })
      .exec();
      const total = packages.length;
  
    return { data: packages, total };
  }
  
  
  async findOne(id: string): Promise<Package> {
    const packageData = await this.packageModel
      .findById(id)
      .populate({
        path: 'services', 
        select: 'name',   
      })//for populating services name attached with packages
      .exec();
  
    if (!packageData) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
  
    return packageData;
  }
  
  //
  async update(id: string, updatePackageDto: CreatePackageDto): Promise<Package> {
    const { services: serviceNames, ...updateData } = updatePackageDto;
  
    const updatePayload: any = {
      ...updateData,
    };
  
    if (serviceNames) updatePayload.services = serviceNames;

    const updatedPackage = await this.packageModel.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true }, 
    ).exec();
  
    if (!updatedPackage) 
      throw new NotFoundException(`Package with ID ${id} not found`);
  
    return updatedPackage;
  }

  //Delete a package record 
  async remove(id: string): Promise<Package> {
    const packageData = await this.packageModel.findByIdAndDelete(id).exec();
    if (!packageData) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    return packageData;
  }
}
