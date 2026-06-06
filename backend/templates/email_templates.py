
class EmailTemplates:
    @staticmethod
    def verification_email(token):
        return f"Please verify your account: https://fiduscan.com/verify?token={token}"
        
    @staticmethod
    def password_reset(token):
        return f"Reset your password: https://fiduscan.com/reset?token={token}"
        
    @staticmethod
    def team_invitation(org_name, link):
        return f"You have been invited to join {org_name}: {link}"
        
    @staticmethod
    def billing_receipt(amount, date):
        return f"Receipt for your payment of ${amount} on {date}"
