import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MessageController {
  /**
   * Submit a new message
   * POST /api/messages
   * Body: { content: string, category: string, authorId: string }
   */
  static async createMessage(req: Request, res: Response) {
    try {
      const { content, category, authorId } = req.body;

      // Validation
      if (!content || !content.trim()) {
        return res.status(400).json({
          error: 'Content is required'
        });
      }

      // if (content.length < 10) {
      //   return res.status(400).json({
      //     error: 'Content must be at least 10 characters long'
      //   });
      // }

      // if (content.length > 1000) {
      //   return res.status(400).json({
      //     error: 'Content must not exceed 1000 characters'
      //   });
      // }

      if (!category) {
        return res.status(400).json({
          error: 'Category is required'
        });
      }

      // const validCategories = ['ACADEMIC', 'DORM', 'SOCIAL', 'GENERAL'];
      // if (!validCategories.includes(category.toUpperCase())) {
      //   return res.status(400).json({
      //     error: 'Invalid category. Must be ACADEMIC, DORM, SOCIAL, or GENERAL'
      //   });
      // }

      if (!authorId) {
        return res.status(400).json({
          error: 'Author ID is required'
        });
      }

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: authorId }
      });

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      // Create message with PENDING status
      const message = await prisma.message.create({
        data: {
          content: content.trim(),
          category: category.toUpperCase(),
          status: 'PENDING',
          authorId: authorId
        },
        select: {
          id: true,
          content: true,
          category: true,
          status: true,
          createdAt: true
        }
      });

      return res.status(201).json({
        message: 'Message submitted successfully. Waiting for admin approval.',
        data: message
      });

    } catch (error) {
      console.error('Error creating message:', error);
      return res.status(500).json({
        error: 'Failed to create message'
      });
    }
  }

  /**
   * Get user's own submitted messages
   * GET /api/messages/my-submissions?authorId=xxx
   */
  static async getMySubmissions(req: Request, res: Response) {
    try {
      const { authorId } = req.query;

      if (!authorId) {
        return res.status(400).json({
          error: 'Author ID is required'
        });
      }

      const messages = await prisma.message.findMany({
        where: {
          authorId: authorId as string
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          content: true,
          category: true,
          status: true,
          createdAt: true,
          submittedAt: true
        }
      });

      return res.status(200).json({
        data: messages,
        total: messages.length
      });

    } catch (error) {
      console.error('Error fetching submissions:', error);
      return res.status(500).json({
        error: 'Failed to fetch submissions'
      });
    }
  }

  /**
   * Delete a pending message (student can delete their own pending messages)
   * DELETE /api/messages/:id
   */
  static async deleteMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { authorId } = req.body;

      if (!authorId) {
        return res.status(400).json({
          error: 'Author ID is required'
        });
      }

      // Find the message
      const message = await prisma.message.findUnique({
        where: { id }
      });

      if (!message) {
        return res.status(404).json({
          error: 'Message not found'
        });
      }

      // Only allow deleting pending messages
      if (message.status !== 'PENDING') {
        return res.status(400).json({
          error: 'You can only delete pending messages'
        });
      }

      // Delete the message
      await prisma.message.delete({
        where: { id }
      });

      return res.status(200).json({
        message: 'Message deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting message:', error);
      return res.status(500).json({
        error: 'Failed to delete message'
      });
    }
  }
}