// src/api/services/property.service.ts

import prisma from "../../config/prisma";
import { Property } from "@prisma/client";

export async function createNewProperty(propertyData: any): Promise<Property> {
  const { name, pricePerNight } = propertyData;
  return prisma.property.create({
    data: {
      name,
      pricePerNight,
    },
  });
}

export async function getAll(page: number, limit: number) {
  // Calculate the number of items to skip
  const skip = (page - 1) * limit;

  // 1. Fetch the data for the current page
  const properties = await prisma.property.findMany({
    skip: skip,
    take: limit,
  });

  // 2. Get the total count of all properties
  const totalProperties = await prisma.property.count();

  // 3. Return both the data and the pagination info
  return {
    data: properties,
    total: totalProperties,
    page: page,
    totalPages: Math.ceil(totalProperties / limit),
  };
}

export async function getById(id: string): Promise<Property | null> {
  return prisma.property.findUnique({
    where: { id },
  });
}

export async function update(id: string, propertyData: any): Promise<Property> {
  const { name, pricePerNight } = propertyData;
  return prisma.property.update({
    where: { id },
    data: {
      name,
      pricePerNight,
    },
  });
}

export async function remove(id: string): Promise<Property> {
  return prisma.property.delete({
    where: { id },
  });
}