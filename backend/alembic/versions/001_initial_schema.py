"""Initial database schema with 15 core entities

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-08-17 19:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users
    op.create_table(
        "users",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("username", sa.String(length=100), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_username"), "users", ["username"], unique=True)

    # 2. workspaces
    op.create_table(
        "workspaces",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("owner_id", sa.String(length=36), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_workspaces_slug"), "workspaces", ["slug"], unique=True)
    op.create_index(op.f("ix_workspaces_owner_id"), "workspaces", ["owner_id"], unique=False)

    # 3. repositories
    op.create_table(
        "repositories",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("workspace_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("url", sa.String(length=1024), nullable=False),
        sa.Column("provider", sa.String(length=50), nullable=False, server_default="github"),
        sa.Column("owner_name", sa.String(length=255), nullable=True),
        sa.Column("default_branch", sa.String(length=100), nullable=False, server_default="main"),
        sa.Column("current_commit_sha", sa.String(length=64), nullable=True),
        sa.Column("connection_status", sa.String(length=50), nullable=False, server_default="connected"),
        sa.Column("analysis_status", sa.String(length=50), nullable=False, server_default="pending"),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("metadata_json", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["workspace_id"], ["workspaces.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("workspace_id", "name", name="uq_workspace_repo_name"),
    )
    op.create_index(op.f("ix_repositories_workspace_id"), "repositories", ["workspace_id"], unique=False)
    op.create_index(op.f("ix_repositories_name"), "repositories", ["name"], unique=False)
    op.create_index(op.f("ix_repositories_current_commit_sha"), "repositories", ["current_commit_sha"], unique=False)

    # 4. analyses
    op.create_table(
        "analyses",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("repository_id", sa.String(length=36), nullable=False),
        sa.Column("commit_sha", sa.String(length=64), nullable=True),
        sa.Column("branch", sa.String(length=100), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="pending"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("metadata_json", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["repository_id"], ["repositories.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_analyses_repository_id"), "analyses", ["repository_id"], unique=False)
    op.create_index(op.f("ix_analyses_status"), "analyses", ["status"], unique=False)
    op.create_index(op.f("ix_analyses_commit_sha"), "analyses", ["commit_sha"], unique=False)

    # 5. commits
    op.create_table(
        "commits",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("repository_id", sa.String(length=36), nullable=False),
        sa.Column("commit_sha", sa.String(length=64), nullable=False),
        sa.Column("author_name", sa.String(length=255), nullable=True),
        sa.Column("author_email", sa.String(length=255), nullable=True),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("committed_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("parent_shas", sa.JSON(), nullable=True),
        sa.Column("stats", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["repository_id"], ["repositories.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("repository_id", "commit_sha", name="uq_repo_commit_sha"),
    )
    op.create_index(op.f("ix_commits_repository_id"), "commits", ["repository_id"], unique=False)
    op.create_index(op.f("ix_commits_commit_sha"), "commits", ["commit_sha"], unique=False)
    op.create_index(op.f("ix_commits_committed_at"), "commits", ["committed_at"], unique=False)

    # 6. files
    op.create_table(
        "files",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("repository_id", sa.String(length=36), nullable=False),
        sa.Column("analysis_id", sa.String(length=36), nullable=True),
        sa.Column("path", sa.String(length=1024), nullable=False),
        sa.Column("language", sa.String(length=50), nullable=True),
        sa.Column("size_bytes", sa.BigInteger(), nullable=False, server_default="0"),
        sa.Column("line_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("content_hash", sa.String(length=64), nullable=True),
        sa.Column("source_metadata", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["analysis_id"], ["analyses.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["repository_id"], ["repositories.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("repository_id", "path", name="uq_repo_file_path"),
    )
    op.create_index(op.f("ix_files_repository_id"), "files", ["repository_id"], unique=False)
    op.create_index(op.f("ix_files_analysis_id"), "files", ["analysis_id"], unique=False)
    op.create_index(op.f("ix_files_path"), "files", ["path"], unique=False)
    op.create_index(op.f("ix_files_language"), "files", ["language"], unique=False)
    op.create_index(op.f("ix_files_content_hash"), "files", ["content_hash"], unique=False)

    # 7. symbols
    op.create_table(
        "symbols",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("repository_id", sa.String(length=36), nullable=False),
        sa.Column("file_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("symbol_type", sa.String(length=50), nullable=False),
        sa.Column("qualified_name", sa.String(length=1024), nullable=False),
        sa.Column("start_line", sa.Integer(), nullable=False),
        sa.Column("end_line", sa.Integer(), nullable=False),
        sa.Column("start_column", sa.Integer(), nullable=True),
        sa.Column("end_column", sa.Integer(), nullable=True),
        sa.Column("docstring", sa.Text(), nullable=True),
        sa.Column("ast_metadata", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["file_id"], ["files.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["repository_id"], ["repositories.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_symbols_repository_id"), "symbols", ["repository_id"], unique=False)
    op.create_index(op.f("ix_symbols_file_id"), "symbols", ["file_id"], unique=False)
    op.create_index(op.f("ix_symbols_name"), "symbols", ["name"], unique=False)
    op.create_index(op.f("ix_symbols_symbol_type"), "symbols", ["symbol_type"], unique=False)
    op.create_index(op.f("ix_symbols_qualified_name"), "symbols", ["qualified_name"], unique=False)
    op.create_index("ix_symbols_repo_file", "symbols", ["repository_id", "file_id"], unique=False)
    op.create_index("ix_symbols_repo_name", "symbols", ["repository_id", "name"], unique=False)

    # 8. dependencies
    op.create_table(
        "dependencies",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("repository_id", sa.String(length=36), nullable=False),
        sa.Column("analysis_id", sa.String(length=36), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("version_spec", sa.String(length=100), nullable=True),
        sa.Column("dependency_type", sa.String(length=50), nullable=False, server_default="direct"),
        sa.Column("package_manager", sa.String(length=50), nullable=True),
        sa.Column("source_file_id", sa.String(length=36), nullable=True),
        sa.Column("metadata_json", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["analysis_id"], ["analyses.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["repository_id"], ["repositories.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["source_file_id"], ["files.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_dependencies_repository_id"), "dependencies", ["repository_id"], unique=False)
    op.create_index(op.f("ix_dependencies_analysis_id"), "dependencies", ["analysis_id"], unique=False)
    op.create_index(op.f("ix_dependencies_name"), "dependencies", ["name"], unique=False)
    op.create_index(op.f("ix_dependencies_dependency_type"), "dependencies", ["dependency_type"], unique=False)
    op.create_index(op.f("ix_dependencies_package_manager"), "dependencies", ["package_manager"], unique=False)
    op.create_index(op.f("ix_dependencies_source_file_id"), "dependencies", ["source_file_id"], unique=False)
    op.create_index("ix_dependencies_repo_name", "dependencies", ["repository_id", "name"], unique=False)

    # 9. graph_nodes
    op.create_table(
        "graph_nodes",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("repository_id", sa.String(length=36), nullable=False),
        sa.Column("analysis_id", sa.String(length=36), nullable=True),
        sa.Column("node_key", sa.String(length=512), nullable=False),
        sa.Column("node_type", sa.String(length=50), nullable=False),
        sa.Column("label", sa.String(length=255), nullable=False),
        sa.Column("file_id", sa.String(length=36), nullable=True),
        sa.Column("symbol_id", sa.String(length=36), nullable=True),
        sa.Column("properties", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["analysis_id"], ["analyses.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["file_id"], ["files.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["repository_id"], ["repositories.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["symbol_id"], ["symbols.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("repository_id", "node_key", name="uq_repo_node_key"),
    )
    op.create_index(op.f("ix_graph_nodes_repository_id"), "graph_nodes", ["repository_id"], unique=False)
    op.create_index(op.f("ix_graph_nodes_analysis_id"), "graph_nodes", ["analysis_id"], unique=False)
    op.create_index(op.f("ix_graph_nodes_node_key"), "graph_nodes", ["node_key"], unique=False)
    op.create_index(op.f("ix_graph_nodes_node_type"), "graph_nodes", ["node_type"], unique=False)
    op.create_index(op.f("ix_graph_nodes_file_id"), "graph_nodes", ["file_id"], unique=False)
    op.create_index(op.f("ix_graph_nodes_symbol_id"), "graph_nodes", ["symbol_id"], unique=False)
    op.create_index("ix_graph_nodes_repo_type", "graph_nodes", ["repository_id", "node_type"], unique=False)

    # 10. graph_relationships
    op.create_table(
        "graph_relationships",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("repository_id", sa.String(length=36), nullable=False),
        sa.Column("analysis_id", sa.String(length=36), nullable=True),
        sa.Column("source_node_id", sa.String(length=36), nullable=False),
        sa.Column("target_node_id", sa.String(length=36), nullable=False),
        sa.Column("relationship_type", sa.String(length=50), nullable=False),
        sa.Column("weight", sa.Float(), nullable=False, server_default="1.0"),
        sa.Column("properties", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["analysis_id"], ["analyses.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["repository_id"], ["repositories.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["source_node_id"], ["graph_nodes.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["target_node_id"], ["graph_nodes.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_graph_relationships_repository_id"), "graph_relationships", ["repository_id"], unique=False)
    op.create_index(op.f("ix_graph_relationships_analysis_id"), "graph_relationships", ["analysis_id"], unique=False)
    op.create_index(op.f("ix_graph_relationships_source_node_id"), "graph_relationships", ["source_node_id"], unique=False)
    op.create_index(op.f("ix_graph_relationships_target_node_id"), "graph_relationships", ["target_node_id"], unique=False)
    op.create_index(op.f("ix_graph_relationships_relationship_type"), "graph_relationships", ["relationship_type"], unique=False)
    op.create_index("ix_graph_rel_repo_nodes", "graph_relationships", ["repository_id", "source_node_id", "target_node_id"], unique=False)
    op.create_index("ix_graph_rel_type", "graph_relationships", ["repository_id", "relationship_type"], unique=False)

    # 11. metrics
    op.create_table(
        "metrics",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("repository_id", sa.String(length=36), nullable=False),
        sa.Column("analysis_id", sa.String(length=36), nullable=False),
        sa.Column("category", sa.String(length=50), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("value", sa.Float(), nullable=False),
        sa.Column("unit", sa.String(length=50), nullable=True),
        sa.Column("details", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["analysis_id"], ["analyses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["repository_id"], ["repositories.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_metrics_repository_id"), "metrics", ["repository_id"], unique=False)
    op.create_index(op.f("ix_metrics_analysis_id"), "metrics", ["analysis_id"], unique=False)
    op.create_index(op.f("ix_metrics_category"), "metrics", ["category"], unique=False)
    op.create_index(op.f("ix_metrics_name"), "metrics", ["name"], unique=False)
    op.create_index("ix_metrics_analysis_name", "metrics", ["analysis_id", "name"], unique=False)
    op.create_index("ix_metrics_repo_category", "metrics", ["repository_id", "category"], unique=False)

    # 12. findings
    op.create_table(
        "findings",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("repository_id", sa.String(length=36), nullable=False),
        sa.Column("analysis_id", sa.String(length=36), nullable=False),
        sa.Column("file_id", sa.String(length=36), nullable=True),
        sa.Column("symbol_id", sa.String(length=36), nullable=True),
        sa.Column("rule_id", sa.String(length=100), nullable=False),
        sa.Column("category", sa.String(length=50), nullable=False),
        sa.Column("severity", sa.String(length=20), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("line_start", sa.Integer(), nullable=True),
        sa.Column("line_end", sa.Integer(), nullable=True),
        sa.Column("evidence", sa.JSON(), nullable=True),
        sa.Column("remediation", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["analysis_id"], ["analyses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["file_id"], ["files.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["repository_id"], ["repositories.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["symbol_id"], ["symbols.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_findings_repository_id"), "findings", ["repository_id"], unique=False)
    op.create_index(op.f("ix_findings_analysis_id"), "findings", ["analysis_id"], unique=False)
    op.create_index(op.f("ix_findings_file_id"), "findings", ["file_id"], unique=False)
    op.create_index(op.f("ix_findings_symbol_id"), "findings", ["symbol_id"], unique=False)
    op.create_index(op.f("ix_findings_rule_id"), "findings", ["rule_id"], unique=False)
    op.create_index(op.f("ix_findings_category"), "findings", ["category"], unique=False)
    op.create_index(op.f("ix_findings_severity"), "findings", ["severity"], unique=False)
    op.create_index("ix_findings_analysis_sev", "findings", ["analysis_id", "severity"], unique=False)
    op.create_index("ix_findings_repo_cat", "findings", ["repository_id", "category"], unique=False)

    # 13. investigations
    op.create_table(
        "investigations",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("repository_id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="open"),
        sa.Column("query", sa.Text(), nullable=False),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("findings_summary", sa.JSON(), nullable=True),
        sa.Column("metadata_json", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["repository_id"], ["repositories.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_investigations_repository_id"), "investigations", ["repository_id"], unique=False)
    op.create_index(op.f("ix_investigations_user_id"), "investigations", ["user_id"], unique=False)
    op.create_index(op.f("ix_investigations_status"), "investigations", ["status"], unique=False)

    # 14. simulations
    op.create_table(
        "simulations",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("repository_id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("simulation_type", sa.String(length=50), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="pending"),
        sa.Column("parameters", sa.JSON(), nullable=True),
        sa.Column("results", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["repository_id"], ["repositories.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_simulations_repository_id"), "simulations", ["repository_id"], unique=False)
    op.create_index(op.f("ix_simulations_user_id"), "simulations", ["user_id"], unique=False)
    op.create_index(op.f("ix_simulations_simulation_type"), "simulations", ["simulation_type"], unique=False)
    op.create_index(op.f("ix_simulations_status"), "simulations", ["status"], unique=False)

    # 15. conversations
    op.create_table(
        "conversations",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("repository_id", sa.String(length=36), nullable=True),
        sa.Column("workspace_id", sa.String(length=36), nullable=True),
        sa.Column("user_id", sa.String(length=36), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("context_type", sa.String(length=50), nullable=False, server_default="repository"),
        sa.Column("messages", sa.JSON(), nullable=True),
        sa.Column("metadata_json", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["repository_id"], ["repositories.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["workspace_id"], ["workspaces.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_conversations_repository_id"), "conversations", ["repository_id"], unique=False)
    op.create_index(op.f("ix_conversations_workspace_id"), "conversations", ["workspace_id"], unique=False)
    op.create_index(op.f("ix_conversations_user_id"), "conversations", ["user_id"], unique=False)
    op.create_index(op.f("ix_conversations_context_type"), "conversations", ["context_type"], unique=False)


def downgrade() -> None:
    op.drop_table("conversations")
    op.drop_table("simulations")
    op.drop_table("investigations")
    op.drop_table("findings")
    op.drop_table("metrics")
    op.drop_table("graph_relationships")
    op.drop_table("graph_nodes")
    op.drop_table("dependencies")
    op.drop_table("symbols")
    op.drop_table("files")
    op.drop_table("commits")
    op.drop_table("analyses")
    op.drop_table("repositories")
    op.drop_table("workspaces")
    op.drop_table("users")
