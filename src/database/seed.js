const { createTables, seedDatabase } = require('./migrate');

const runMigration = async () => {
  try {
    console.log('🔄 Starting database migration...');
    await createTables();
    await seedDatabase();
    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigration();

