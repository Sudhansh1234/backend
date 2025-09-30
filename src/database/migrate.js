const pool = require('./connection');

const createTables = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
        priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    const bcrypt = require('bcryptjs');
    
    // Check if admin user already exists
    const adminExists = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@example.com']);
    
    if (adminExists.rows.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await pool.query(`
        INSERT INTO users (email, password, first_name, last_name, role)
        VALUES ($1, $2, $3, $4, $5)
      `, ['admin@example.com', hashedPassword, 'Admin', 'User', 'admin']);
      
      console.log('✅ Admin user created (email: admin@example.com, password: admin123)');
    }

    // Check if test user exists
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', ['user@example.com']);
    
    if (userExists.rows.length === 0) {
      // Create test user
      const hashedPassword = await bcrypt.hash('user123', 12);
      const result = await pool.query(`
        INSERT INTO users (email, password, first_name, last_name, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, ['user@example.com', hashedPassword, 'Test', 'User', 'user']);
      
      const userId = result.rows[0].id;
      
      // Create sample tasks for the test user
      await pool.query(`
        INSERT INTO tasks (title, description, status, priority, user_id)
        VALUES 
        ($1, $2, $3, $4, $5),
        ($6, $7, $8, $9, $10),
        ($11, $12, $13, $14, $15)
      `, [
        'Complete project assignment', 'Build a scalable REST API with authentication', 'pending', 'high', userId,
        'Review code documentation', 'Update API documentation and README', 'in_progress', 'medium', userId,
        'Setup deployment pipeline', 'Configure Docker and CI/CD', 'pending', 'low', userId
      ]);
      
      console.log('✅ Test user and sample tasks created');
    }
    
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = {
  createTables,
  seedDatabase
};

