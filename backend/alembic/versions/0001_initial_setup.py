"""Initial migration with persons and professions tables and seed data

Revision ID: 0001_initial_setup
Revises: 
Create Date: 2025-08-22 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0001_initial_setup'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create professions table
    op.create_table('professions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_professions_id'), 'professions', ['id'], unique=False)
    op.create_index(op.f('ix_professions_name'), 'professions', ['name'], unique=True)

    # Create persons table with foreign key to professions
    op.create_table('persons',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('first_name', sa.String(length=100), nullable=False),
        sa.Column('last_name', sa.String(length=100), nullable=False),
        sa.Column('birth_date', sa.Date(), nullable=False),
        sa.Column('age', sa.Integer(), nullable=False),
        sa.Column('profession_id', sa.Integer(), nullable=False),
        sa.Column('address', sa.Text(), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=False),
        sa.Column('photo_url', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['profession_id'], ['professions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_persons_id'), 'persons', ['id'], unique=False)

    # Insert seed data for professions
    op.execute("""
        INSERT INTO professions (name) VALUES 
        ('INGENIERO DE SISTEMAS'),
        ('MÉDICO GENERAL'),
        ('ABOGADO'),
        ('ARQUITECTO'),
        ('DISEÑADOR GRÁFICO'),
        ('ADMINISTRADOR DE EMPRESAS'),
        ('PSICÓLOGO'),
        ('PROFESOR'),
        ('VENDEDOR'),
        ('CHEF')
    """)

    # Insert seed data for persons with profession_id references
    op.execute("""
        INSERT INTO persons (first_name, last_name, birth_date, age, profession_id, address, phone) VALUES 
        ('Juan Carlos', 'Pérez García', '1990-05-15', 34, 1, 'Calle 123 #45-67, Bogotá', '0987456321'),
        ('María Elena', 'González López', '1985-08-22', 39, 2, 'Carrera 45 #123-89, Medellín', '0987456321'),
        ('Carlos Alberto', 'Rodríguez Silva', '1992-03-10', 32, 3, 'Avenida 80 #12-34, Cali', '0987456321'),
        ('Ana Sofía', 'Martínez Torres', '1988-11-30', 35, 4, 'Calle 72 #89-01, Barranquilla', '0987456321'),
        ('Diego Fernando', 'Hernández Cruz', '1995-07-18', 29, 5, 'Carrera 15 #67-23, Cartagena', '0987456321'),
        ('Luisa Fernanda', 'Jiménez Morales', '1991-12-05', 33, 6, 'Calle 85 #34-56, Bucaramanga', '0987456321'),
        ('Andrés Felipe', 'Castro Vargas', '1987-04-25', 37, 7, 'Avenida 68 #45-78, Pereira', '0987456321'),
        ('Paola Andrea', 'Ramos Delgado', '1993-09-12', 31, 8, 'Carrera 30 #12-90, Manizales', '0987456321'),
        ('Miguel Ángel', 'Torres Aguilar', '1989-01-08', 35, 9, 'Calle 50 #78-12, Ibagué', '0987456321'),
        ('Valentina', 'Ruiz Castillo', '1994-06-20', 30, 10, 'Avenida 19 #23-45, Santa Marta', '0987456321'),
        ('Santiago', 'Moreno Vega', '1986-10-14', 38, 9, 'Carrera 7 #56-89, Villavicencio', '0987456321'),
        ('Isabella', 'Gómez Herrera', '1996-02-28', 28, 8, 'Calle 26 #90-23, Pasto', '0987456321'),
        ('Sebastián', 'López Mendoza', '1990-08-03', 34, 7, 'Avenida 9 #34-67, Neiva', '0987456321'),
        ('Camila', 'Vargas Sánchez', '1992-12-16', 32, 6, 'Carrera 25 #78-01, Popayán', '0987456321'),
        ('Nicolás', 'Silva Ramírez', '1987-05-09', 37, 5, 'Calle 40 #12-34, Armenia', '0987456321')
    """)


def downgrade() -> None:
    op.drop_index(op.f('ix_persons_id'), table_name='persons')
    op.drop_table('persons')
    op.drop_index(op.f('ix_professions_name'), table_name='professions')
    op.drop_index(op.f('ix_professions_id'), table_name='professions')
    op.drop_table('professions')
