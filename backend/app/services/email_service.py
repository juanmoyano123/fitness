"""
Email Service - Handles email sending via SendGrid
"""
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails using SendGrid"""

    def __init__(self):
        self.api_key = os.getenv('SENDGRID_API_KEY')
        self.from_email = os.getenv('FROM_EMAIL', 'noreply@fitcompass.com')
        self.enabled = bool(self.api_key)

        if not self.enabled:
            logger.warning('SendGrid API key not configured - emails will not be sent')

    def send_client_invitation(self, client_email: str, client_name: str,
                               trainer_name: str, invite_link: str) -> bool:
        """
        Send invitation email to a client

        Args:
            client_email: Client's email address
            client_name: Client's name
            trainer_name: Trainer's name
            invite_link: Registration link with invite token

        Returns:
            bool: True if email was sent successfully, False otherwise
        """
        if not self.enabled:
            logger.warning(f'Email not sent to {client_email} - SendGrid not configured')
            return False

        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=client_email,
                subject=f'{trainer_name} te invitó a FitCompass Pro',
                html_content=self._get_invitation_template(
                    client_name=client_name,
                    trainer_name=trainer_name,
                    invite_link=invite_link
                )
            )

            sg = SendGridAPIClient(self.api_key)
            response = sg.send(message)

            if response.status_code in [200, 201, 202]:
                logger.info(f'Invitation email sent to {client_email}')
                return True
            else:
                logger.error(f'Failed to send email to {client_email}: {response.status_code}')
                return False

        except Exception as e:
            logger.error(f'Error sending email to {client_email}: {str(e)}')
            return False

    def _get_invitation_template(self, client_name: str, trainer_name: str,
                                 invite_link: str) -> str:
        """
        Get HTML template for invitation email

        Args:
            client_name: Client's name
            trainer_name: Trainer's name
            invite_link: Registration link

        Returns:
            str: HTML content for email
        """
        return f'''
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .container {{
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .header {{
            text-align: center;
            margin-bottom: 30px;
        }}
        .logo {{
            font-size: 28px;
            font-weight: bold;
            color: #6366f1;
            margin-bottom: 10px;
        }}
        h1 {{
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
        }}
        .content {{
            margin-bottom: 30px;
        }}
        .button {{
            display: inline-block;
            background-color: #6366f1;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
        }}
        .button:hover {{
            background-color: #4f46e5;
        }}
        .footer {{
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
        }}
        .expiry {{
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏋️ FitCompass Pro</div>
        </div>

        <h1>¡Hola {client_name}!</h1>

        <div class="content">
            <p><strong>{trainer_name}</strong> te ha invitado a usar FitCompass Pro para trackear tus entrenamientos y alcanzar tus objetivos de fitness.</p>

            <p>Con FitCompass Pro podrás:</p>
            <ul>
                <li>📋 Ver tus rutinas personalizadas</li>
                <li>💪 Registrar tus entrenamientos</li>
                <li>📊 Seguir tu progreso</li>
                <li>🎯 Alcanzar tus metas</li>
            </ul>

            <div style="text-align: center;">
                <a href="{invite_link}" class="button">Registrarme Ahora</a>
            </div>

            <div class="expiry">
                ⏰ <strong>Importante:</strong> Este link de invitación expira en 7 días.
            </div>

            <p>Si no esperabas este email o tienes alguna pregunta, puedes contactar directamente a {trainer_name}.</p>
        </div>

        <div class="footer">
            <p>Este es un email automático de FitCompass Pro.</p>
            <p>Si no puedes hacer click en el botón, copia y pega este link en tu navegador:</p>
            <p style="word-break: break-all; color: #6366f1;">{invite_link}</p>
        </div>
    </div>
</body>
</html>
        '''
