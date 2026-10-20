'use strict'

import { DataTypes, QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

/** @type {import('sequelize-cli').Migration} */
export async function up(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  const transaction = await queryInterface.sequelize.transaction()

  try {
    // 1. Buat tabel grades jika belum ada
    const [gradesTableExists]: any = await queryInterface.sequelize.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'grades'`,
      { transaction }
    )

    if (gradesTableExists.length === 0) {
      await queryInterface.createTable(
        'grades',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction }
      )
    }

    // 2. Buat tabel classes jika belum ada
    const [classesTableExists]: any = await queryInterface.sequelize.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'classes'`,
      { transaction }
    )

    if (classesTableExists.length === 0) {
      await queryInterface.createTable(
        'classes',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          GradeId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'grades',
              key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction }
      )
    }

    // Seed default grades & classes jika masih kosong
    const [existingGrades]: any = await queryInterface.sequelize.query(
      `SELECT id FROM grades LIMIT 1`,
      { transaction }
    )

    if (existingGrades.length === 0) {
      const now = new Date()
      const grade7Id = uuidv4()
      const grade8Id = uuidv4()
      const grade9Id = uuidv4()

      await queryInterface.bulkInsert(
        'grades',
        [
          { id: grade7Id, name: 'VII', createdAt: now, updatedAt: now },
          { id: grade8Id, name: 'VIII', createdAt: now, updatedAt: now },
          { id: grade9Id, name: 'IX', createdAt: now, updatedAt: now },
        ],
        { transaction }
      )

      await queryInterface.bulkInsert(
        'classes',
        [
          { id: uuidv4(), name: 'VII-A', GradeId: grade7Id, createdAt: now, updatedAt: now },
          { id: uuidv4(), name: 'VII-B', GradeId: grade7Id, createdAt: now, updatedAt: now },
          { id: uuidv4(), name: 'VIII-A', GradeId: grade8Id, createdAt: now, updatedAt: now },
          { id: uuidv4(), name: 'VIII-B', GradeId: grade8Id, createdAt: now, updatedAt: now },
          { id: uuidv4(), name: 'IX-A', GradeId: grade9Id, createdAt: now, updatedAt: now },
          { id: uuidv4(), name: 'IX-B', GradeId: grade9Id, createdAt: now, updatedAt: now },
        ],
        { transaction }
      )
    }

    // 3. Helper untuk hapus foreign key secara dinamis
    const dropForeignKeyIfExists = async (columnName: string) => {
      const [results]: any = await queryInterface.sequelize.query(
        `SELECT CONSTRAINT_NAME 
         FROM information_schema.KEY_COLUMN_USAGE 
         WHERE TABLE_SCHEMA = DATABASE() 
           AND TABLE_NAME = 'user_details' 
           AND COLUMN_NAME = '${columnName}' 
           AND REFERENCED_TABLE_NAME IS NOT NULL`,
        { transaction }
      )
      for (const row of results) {
        if (row.CONSTRAINT_NAME) {
          try {
            await queryInterface.removeConstraint('user_details', row.CONSTRAINT_NAME, { transaction })
          } catch (e) {
            // ignore
          }
        }
      }
    }

    // Helper untuk hapus kolom jika ada
    const dropColumnIfExists = async (columnName: string) => {
      const [cols]: any = await queryInterface.sequelize.query(
        `SELECT COLUMN_NAME 
         FROM information_schema.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() 
           AND TABLE_NAME = 'user_details' 
           AND COLUMN_NAME = '${columnName}'`,
        { transaction }
      )
      if (cols.length > 0) {
        await queryInterface.removeColumn('user_details', columnName, { transaction })
      }
    }

    // Drop FK constraints
    const columnsToDropFk = [
      'RukunWargaId',
      'RukunTetanggaId',
      'EducationId',
      'SalaryRangeId',
      'MarriageStatusId',
    ]

    for (const col of columnsToDropFk) {
      await dropForeignKeyIfExists(col)
    }

    // Drop kolom yang tidak relevan untuk profil siswa
    const columnsToDrop = [
      'profession',
      'isKader',
      'MarriageStatusId',
      'SalaryRangeId',
      'EducationId',
      'RukunWargaId',
      'RukunTetanggaId',
    ]

    for (const col of columnsToDrop) {
      await dropColumnIfExists(col)
    }

    // 4. Ubah nik -> nisn (STRING(10), UNIQUE)
    const [nikCol]: any = await queryInterface.sequelize.query(
      `SELECT COLUMN_NAME 
       FROM information_schema.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = 'user_details' 
         AND COLUMN_NAME = 'nik'`,
      { transaction }
    )

    const [nisnCol]: any = await queryInterface.sequelize.query(
      `SELECT COLUMN_NAME 
       FROM information_schema.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = 'user_details' 
         AND COLUMN_NAME = 'nisn'`,
      { transaction }
    )

    if (nikCol.length > 0 && nisnCol.length === 0) {
      // Hapus unique index lama jika ada
      try {
        await queryInterface.removeIndex('user_details', 'unique_nik', { transaction })
      } catch (e) {
        // ignore
      }

      await queryInterface.renameColumn('user_details', 'nik', 'nisn', { transaction })
      await queryInterface.changeColumn(
        'user_details',
        'nisn',
        {
          type: Sequelize.STRING(10),
          allowNull: true,
        },
        { transaction }
      )

      try {
        await queryInterface.addConstraint('user_details', {
          fields: ['nisn'],
          type: 'unique',
          name: 'unique_nisn',
          transaction,
        })
      } catch (e) {
        // ignore
      }
    } else if (nisnCol.length === 0) {
      await queryInterface.addColumn(
        'user_details',
        'nisn',
        {
          type: Sequelize.STRING(10),
          allowNull: true,
          unique: true,
        },
        { transaction }
      )
    }

    // 5. Tambahkan kolom GradeId, ClassId, nis, entryYear, academicYear
    const addColumnIfNotExists = async (columnName: string, options: any) => {
      const [cols]: any = await queryInterface.sequelize.query(
        `SELECT COLUMN_NAME 
         FROM information_schema.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() 
           AND TABLE_NAME = 'user_details' 
           AND COLUMN_NAME = '${columnName}'`,
        { transaction }
      )
      if (cols.length === 0) {
        await queryInterface.addColumn('user_details', columnName, options, { transaction })
      }
    }

    await addColumnIfNotExists('GradeId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'grades',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    })

    await addColumnIfNotExists('ClassId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'classes',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    })

    await addColumnIfNotExists('nis', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    await addColumnIfNotExists('entryYear', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    await addColumnIfNotExists('academicYear', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

/** @type {import('sequelize-cli').Migration} */
export async function down(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  const transaction = await queryInterface.sequelize.transaction()

  try {
    // Drop academic columns
    const columnsToDrop = ['academicYear', 'entryYear', 'nis', 'ClassId', 'GradeId']
    for (const col of columnsToDrop) {
      try {
        await queryInterface.removeColumn('user_details', col, { transaction })
      } catch (e) {
        // ignore
      }
    }

    // Revert nisn -> nik
    try {
      await queryInterface.removeIndex('user_details', 'unique_nisn', { transaction })
    } catch (e) {
      // ignore
    }

    try {
      await queryInterface.renameColumn('user_details', 'nisn', 'nik', { transaction })
      await queryInterface.changeColumn(
        'user_details',
        'nik',
        {
          type: Sequelize.STRING(16),
          allowNull: true,
        },
        { transaction }
      )
      await queryInterface.addConstraint('user_details', {
        fields: ['nik'],
        type: 'unique',
        name: 'unique_nik',
        transaction,
      })
    } catch (e) {
      // ignore
    }

    // Re-add dropped demographic columns
    await queryInterface.addColumn(
      'user_details',
      'profession',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
      { transaction }
    )

    await queryInterface.addColumn(
      'user_details',
      'isKader',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      { transaction }
    )

    // Drop classes and grades
    await queryInterface.dropTable('classes', { transaction })
    await queryInterface.dropTable('grades', { transaction })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
