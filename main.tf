terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>2.84.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "lab3-pad"
  location = "westeurope"
  tags = {
    "env"   = "dev"
    "sauce" = "Terraform"
  }
}

resource "azurerm_container_registry" "acr" {
  name                = "lab3containerregistry"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_app_service_plan" "asp" {
  name                = "padlab3-service-plan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Free"
    size = "F1"
  }
}

resource "azurerm_app_service" "app-service" {
  name                = "cool-webapp"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.asp.id
  app_settings = {
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = false
    DOCKER_CUSTOM_IMAGE_NAME            = "node-web-app:latest"
    DOCKER_ENABLE_CI                    = "true"
    DOCKER_REGISTRY_SERVER_PASSWORD     = "${azurerm_container_registry.acr.admin_password}"
    DOCKER_REGISTRY_SERVER_URL          = "https://${azurerm_container_registry.acr.login_server}"
    DOCKER_REGISTRY_SERVER_USERNAME     = "${azurerm_container_registry.acr.admin_username}"

  }
  site_config {
    app_command_line          = ""
    use_32_bit_worker_process = true
    always_on                 = false
    # linux_fx_version = "DOCKER|${azurerm_container_registry.acr.name}/node-web-app:latest"
    linux_fx_version = "DOCKER|${azurerm_container_registry.acr.login_server}/node-web-app:latest"
  }

}