import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { FeedQuery, PaginatedResponse, FeedMessage } from '../types';

const prisma = new PrismaClient();

export class FeedController {
  /**
   * Get paginated approved messages for the feed
   * GET /api/feed?page=1&limit=10&category=ACADEMIC
   */
  static async getFeed(req: Request, res: Response) {
    try {
      // Parse query parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as FeedQuery['category'];

      // Validate pagination parameters
      if (page < 1) {
        return res.status(400).json({
          error: 'Page number must be greater than 0'
        });
      }

      if (limit < 1 || limit > 50) {
        return res.status(400).json({
          error: 'Limit must be between 1 and 50'
        });
      }

      // Calculate offset for pagination
      const skip = (page - 1) * limit;

      const whereClause: any = {
        status: 'APPROVED'
      };

      // Add category filter if provided
      if (category) {
        if (!['ACADEMIC', 'DORM', 'SOCIAL', 'GENERAL'].includes(category)) {
          return res.status(400).json({
            error: 'Invalid category. Must be ACADEMIC, DORM, SOCIAL, or GENERAL'
          });
        }
        whereClause.category = category;
      }

      // Fetch messages with pagination
      const [messages, totalCount] = await Promise.all([
        prisma.message.findMany({
          where: whereClause,
          orderBy: {
            createdAt: 'desc'
          },
          skip: skip,
          take: limit,
          select: {
            id: true,
            content: true,
            category: true,
            createdAt: true,
          }
        }),
        prisma.message.count({
          where: whereClause
        })
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      // Format response
      const response: PaginatedResponse<FeedMessage> = {
        data: messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          category: msg.category,
          createdAt: msg.createdAt.toISOString()
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage,
          hasPreviousPage
        }
      };

      return res.status(200).json(response);

    } catch (error) {
      console.error('Error fetching feed:', error);
      return res.status(500).json({
        error: 'Failed to fetch feed'
      });
    }
  }

  /**
   * Get a single message by ID (for detail view if needed)
   * GET /api/feed/:id
   */
  static async getMessageById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const message = await prisma.message.findUnique({
        where: {
          id,
          status: 'APPROVED'
        },
        select: {
          id: true,
          content: true,
          category: true,
          createdAt: true,
        }
      });

      if (!message) {
        return res.status(404).json({
          error: 'Message not found'
        });
      }

      return res.status(200).json({
        id: message.id,
        content: message.content,
        category: message.category,
        createdAt: message.createdAt.toISOString()
      });

    } catch (error) {
      console.error('Error fetching message:', error);
      return res.status(500).json({
        error: 'Failed to fetch message'
      });
    }
  }
}