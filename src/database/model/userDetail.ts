import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Table,
} from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import User from './user'
import Grade from './grade'
import Class from './class'
import Family from './family'

@Table({ freezeTableName: true, tableName: 'user_details' })
export default class UserDetail extends BaseSchema {
  @Column({ type: DataType.STRING(10), allowNull: true, unique: true })
  nisn: string

  @Column({ type: DataType.STRING, allowNull: true })
  nis: string

  @Column({ type: DataType.STRING, allowNull: true })
  entryYear: string

  @Column({ type: DataType.STRING, allowNull: true })
  academicYear: string

  @Column({ type: DataType.STRING, allowNull: true, unique: true })
  phoneNumber: string

  @Column({ type: DataType.ENUM('m', 'f'), allowNull: false })
  gender: string

  @Column({ type: DataType.DATEONLY, allowNull: false })
  birthDate: Date

  @IsUUID(4)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  UserId: string

  @BelongsTo(() => User)
  user: User

  @IsUUID(4)
  @ForeignKey(() => Grade)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  GradeId: string

  @BelongsTo(() => Grade)
  grade: Grade

  @IsUUID(4)
  @ForeignKey(() => Class)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  ClassId: string

  @BelongsTo(() => Class)
  class: Class

  @IsUUID(4)
  @ForeignKey(() => Family)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  FamilyId: string

  @BelongsTo(() => Family)
  family: Family

  // Getter/setter for backward compatibility with code that accessed nik
  get nik(): string {
    return this.nisn
  }

  set nik(value: string) {
    this.nisn = value
  }

  get RukunWargaId(): string {
    return this.GradeId
  }

  set RukunWargaId(value: string) {
    this.GradeId = value
  }

  get RukunTetanggaId(): string {
    return this.ClassId
  }

  set RukunTetanggaId(value: string) {
    this.ClassId = value
  }
}
