import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../db/entities/departments.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create(createDepartmentDto);
    return await this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find({
      where: { isActive: true }, // Only return active departments
      order: { name: 'ASC' }, // Sort by name
    });
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { departmentId: id }, // Fixed: Use 'id' instead of 'departmentId'
      relations: ['users'], // Include users if needed
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(id);
    Object.assign(department, updateDepartmentDto);
    return await this.departmentRepository.save(department);
  }

  async remove(id: number): Promise<void> {
    const department = await this.findOne(id);

    // Soft delete by setting isActive to false
    department.isActive = false;
    await this.departmentRepository.save(department);

    // Or hard delete if preferred:
    // await this.departmentRepository.remove(department);
  }

  // Additional useful methods
  async findAllWithUsers(): Promise<Department[]> {
    return await this.departmentRepository.find({
      relations: ['users'],
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findByName(name: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { name },
    });

    if (!department) {
      throw new NotFoundException(`Department with name '${name}' not found`);
    }

    return department;
  }

  async getUsersInDepartment(id: number) {
    const department = await this.departmentRepository.findOne({
      where: { departmentId: id },
      relations: ['users'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department.users;
  }
}
