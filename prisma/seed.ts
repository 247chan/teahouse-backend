import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const student = await prisma.user.create({
    data: {
      email: 'student@university.edu',
      password: 'hashedpassword123',
      role: 'STUDENT'
    }
  });

  console.log('✅ Created test student:', student.email);

  const messages: Array<{
    content: string;
    category: 'ACADEMIC' | 'DORM' | 'SOCIAL' | 'GENERAL';
    status: 'APPROVED' | 'REJECTED' | 'PENDING';
  }> = [
    {
      content: 'Does anyone know when the library closes during finals week?',
      category: 'ACADEMIC',
      status: 'APPROVED'
    },
    {
      content: 'Looking for a study group for Computer Science 101. Anyone interested?',
      category: 'ACADEMIC',
      status: 'APPROVED'
    },
    {
      content: 'The Wi-Fi in Building A has been really slow lately. Is anyone else experiencing this?',
      category: 'DORM',
      status: 'APPROVED'
    },
    {
      content: 'There\'s a basketball game this Friday at 6 PM. Who wants to join?',
      category: 'SOCIAL',
      status: 'APPROVED'
    },
    {
      content: 'Can someone explain how to register for next semester\'s classes?',
      category: 'GENERAL',
      status: 'REJECTED'
    },
    {
      content: 'Best coffee shops near campus for late night studying?',
      category: 'SOCIAL',
      status: 'APPROVED'
    },
    {
      content: 'Has anyone taken Professor Smith\'s Economics class? How is it?',
      category: 'ACADEMIC',
      status: 'APPROVED'
    },
    {
      content: 'The washing machines in my dorm are always occupied. Any tips?',
      category: 'DORM',
      status: 'APPROVED'
    },
    {
      content: 'Movie night this Saturday in the common room! Suggestions welcome.',
      category: 'SOCIAL',
      status: 'APPROVED'
    },
    {
      content: 'Where can I find information about campus mental health resources?',
      category: 'GENERAL',
      status: 'APPROVED'
    },
    {
      content: 'Study tips for midterm season? I\'m feeling overwhelmed.',
      category: 'ACADEMIC',
      status: 'REJECTED'
    },
    {
      content: 'Is the dining hall open on weekends?',
      category: 'GENERAL',
      status: 'APPROVED'
    },
    {
      content: 'Looking for roommates for next year. Clean, quiet, serious student.',
      category: 'DORM',
      status: 'APPROVED'
    },
    {
      content: 'Anyone interested in starting a coding club?',
      category: 'SOCIAL',
      status: 'APPROVED'
    },
    {
      content: 'How do I access the online library resources from off-campus?',
      category: 'ACADEMIC',
      status: 'REJECTED'
    }
  ];

  for (let i = 0; i < messages.length; i++) {
    await prisma.message.create({
      data: {
        ...messages[i],
        authorId: student.id,
        submittedAt: new Date(Date.now() - (messages.length - i) * 60000)
      }
    });
    console.log(`✅ Created message ${i + 1}/${messages.length}`);
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });