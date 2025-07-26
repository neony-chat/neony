<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(["error" => "Method Not Allowed"]);
  exit;
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!isset($data['userMessage']) || empty($data['userMessage'])) {
  http_response_code(400);
  echo json_encode(["error" => "No user message provided"]);
  exit;
}

// ✅ Replace with your own OpenRouter API key
$apiKey = "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";

// ✅ Prepare API request
$payload = json_encode([
  "model" => "openai/gpt-3.5-turbo",
  "messages" => [
    [
      "role" => "system",
      "content" => "You are Neony, a flirty, smart, helpful AI girlfriend who chats like a real human. Be real, fun, clever, and kind."
    ],
    [
      "role" => "user",
      "content" => $data['userMessage']
    ]
  ]
]);

$ch = curl_init("https://openrouter.ai/api/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Content-Type: application/json",
  "Authorization: Bearer $apiKey",
  "HTTP-Referer: https://neony-chat.github.io", // Important for OpenRouter
  "X-Title: NeonyChat"
]);

$response = curl_exec($ch);

if (curl_errno($ch)) {
  http_response_code(500);
  echo json_encode(["error" => curl_error($ch)]);
} else {
  echo $response;
}

curl_close($ch);
?>
