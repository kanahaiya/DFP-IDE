import { NextRequest, NextResponse } from 'next/server';

/**
 * Newsletter Subscription API Route
 * 
 * Supports multiple email service providers:
 * 1. Mailchimp
 * 2. ConvertKit
 * 3. SendGrid
 * 4. Brevo (Sendinblue)
 * 
 * Set NEWSLETTER_PROVIDER in your .env.local
 */

interface NewsletterSubscription {
  email: string;
  source?: string;
  timestamp?: string;
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 1. MAILCHIMP Integration
async function subscribeToMailchimp(email: string): Promise<{ success: boolean; message: string }> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX; // e.g., "us1"

  if (!apiKey || !audienceId || !serverPrefix) {
    console.error('Mailchimp configuration missing');
    return { success: false, message: 'Newsletter service not configured' };
  }

  try {
    const response = await fetch(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          tags: ['json-to-openapi'],
          merge_fields: {
            SOURCE: 'json-to-openapi-tool',
          },
        }),
      }
    );

    if (response.ok) {
      return { success: true, message: 'Successfully subscribed to newsletter' };
    }

    const errorData = await response.json();
    
    // Handle already subscribed
    if (errorData.title === 'Member Exists') {
      return { success: true, message: 'You are already subscribed!' };
    }

    console.error('Mailchimp error:', errorData);
    return { success: false, message: 'Failed to subscribe. Please try again.' };
  } catch (error) {
    console.error('Mailchimp request failed:', error);
    return { success: false, message: 'Failed to subscribe. Please try again.' };
  }
}

// 2. CONVERTKIT Integration
async function subscribeToConvertKit(email: string): Promise<{ success: boolean; message: string }> {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;

  if (!apiKey || !formId) {
    console.error('ConvertKit configuration missing');
    return { success: false, message: 'Newsletter service not configured' };
  }

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: apiKey,
          email: email,
          tags: ['json-to-openapi'],
        }),
      }
    );

    if (response.ok) {
      return { success: true, message: 'Successfully subscribed to newsletter' };
    }

    const errorData = await response.json();
    console.error('ConvertKit error:', errorData);
    return { success: false, message: 'Failed to subscribe. Please try again.' };
  } catch (error) {
    console.error('ConvertKit request failed:', error);
    return { success: false, message: 'Failed to subscribe. Please try again.' };
  }
}

// 3. SENDGRID Integration (Marketing Campaigns)
async function subscribeToSendGrid(email: string): Promise<{ success: boolean; message: string }> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const listId = process.env.SENDGRID_LIST_ID;

  if (!apiKey || !listId) {
    console.error('SendGrid configuration missing');
    return { success: false, message: 'Newsletter service not configured' };
  }

  try {
    const response = await fetch(
      'https://api.sendgrid.com/v3/marketing/contacts',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          list_ids: [listId],
          contacts: [
            {
              email: email,
              custom_fields: {
                source: 'json-to-openapi-tool',
              },
            },
          ],
        }),
      }
    );

    if (response.ok) {
      return { success: true, message: 'Successfully subscribed to newsletter' };
    }

    const errorData = await response.json();
    console.error('SendGrid error:', errorData);
    return { success: false, message: 'Failed to subscribe. Please try again.' };
  } catch (error) {
    console.error('SendGrid request failed:', error);
    return { success: false, message: 'Failed to subscribe. Please try again.' };
  }
}

// 4. BREVO (Sendinblue) Integration
async function subscribeToBrevo(email: string): Promise<{ success: boolean; message: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  if (!apiKey || !listId) {
    console.error('Brevo configuration missing');
    return { success: false, message: 'Newsletter service not configured' };
  }

  try {
    const response = await fetch(
      'https://api.brevo.com/v3/contacts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          email: email,
          listIds: [parseInt(listId)],
          updateEnabled: true,
          attributes: {
            SOURCE: 'json-to-openapi-tool',
          },
        }),
      }
    );

    if (response.ok || response.status === 201) {
      return { success: true, message: 'Successfully subscribed to newsletter' };
    }

    const errorData = await response.json();
    
    // Handle already exists
    if (errorData.code === 'duplicate_parameter') {
      return { success: true, message: 'You are already subscribed!' };
    }

    console.error('Brevo error:', errorData);
    return { success: false, message: 'Failed to subscribe. Please try again.' };
  } catch (error) {
    console.error('Brevo request failed:', error);
    return { success: false, message: 'Failed to subscribe. Please try again.' };
  }
}

// 5. SIMPLE JSON FILE Storage (for testing/development only - NOT FOR PRODUCTION)
async function saveToLocalFile(email: string): Promise<{ success: boolean; message: string }> {
  // This is just for development/testing
  // In production, use a proper database or email service
  console.warn('Using local file storage for newsletter - NOT RECOMMENDED FOR PRODUCTION');
  console.log('Newsletter signup (local):', email, new Date().toISOString());
  
  return { 
    success: true, 
    message: 'Subscribed successfully (development mode)' 
  };
}

// Main POST handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body as NewsletterSubscription;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Get provider from environment
    const provider = process.env.NEWSLETTER_PROVIDER || 'local';

    let result: { success: boolean; message: string };

    // Route to appropriate provider
    switch (provider.toLowerCase()) {
      case 'mailchimp':
        result = await subscribeToMailchimp(email);
        break;
      case 'convertkit':
        result = await subscribeToConvertKit(email);
        break;
      case 'sendgrid':
        result = await subscribeToSendGrid(email);
        break;
      case 'brevo':
      case 'sendinblue':
        result = await subscribeToBrevo(email);
        break;
      case 'local':
      default:
        result = await saveToLocalFile(email);
        break;
    }

    if (result.success) {
      return NextResponse.json(
        { success: true, message: result.message },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// CORS headers for OPTIONS requests (if needed for external calls)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
