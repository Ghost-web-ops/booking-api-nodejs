// src/api/controllers/property.controller.ts


import { Request, Response, NextFunction } from "express";
import * as propertyService from "../services/property.service";

export async function createProperty(req: Request, res: Response) {
  try {
    const newProperty = await propertyService.createNewProperty(req.body);
    res.status(201).json(newProperty);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAllProperties(req: Request, res: Response, next: NextFunction) {
  try {
    // Read page and limit from query, provide default values
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await propertyService.getAll(page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getPropertyById(req: Request, res: Response) {
  try {
    const property = await propertyService.getById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateProperty(req: Request, res: Response) {
  try {
    const updatedProperty = await propertyService.update(req.params.id, req.body);
    res.json(updatedProperty);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteProperty(req: Request, res: Response) {
  try {
    await propertyService.remove(req.params.id);
    res.status(204).send(); // 204 No Content is a standard success response for delete
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}