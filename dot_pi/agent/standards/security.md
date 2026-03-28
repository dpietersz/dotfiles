# Security Standards (Project Override)

## Minions AI Infra Specific Security

### AWS Security
- Use IAM roles with minimal permissions
- Enable CloudTrail for audit logging
- Encrypt EBS volumes and S3 buckets
- Use VPC security groups restrictively

### Secrets Management
- Store secrets in AWS SSM Parameter Store
- Use Tailscale for secure SSH access
- Rotate keys regularly through automation
- Never commit credentials to git

### Infrastructure as Code
- Scan Terraform for security issues
- Use resource tagging for compliance
- Enable AWS Config rules
- Regular vulnerability scanning of AMIs